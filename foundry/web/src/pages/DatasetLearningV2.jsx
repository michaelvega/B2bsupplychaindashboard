import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchDatasetLearningV2Projects,
  createDatasetLearningV2Project,
  fetchDatasetLearningV2Project,
  uploadDatasetV2Csv,
  configureDatasetV2Project,
  startDatasetLearningV2,
  isRunning as apiIsRunning,
  pauseRun,
  resumeRun,
  stopRun,
  getRunControl,
  initDb,
  flushDb,
  getApiKey,
  setApiKey,
  hasApiKey,
  getModel,
  setModel,
} from '../api.js';
import { getJSON, setJSON, KEYS } from '../lib/storage.js';
import { friendlyError, trailingRejections } from '../lib/runState.js';
import { parseCsvPreview } from '../lib/csvPreview.js';
import { projectToForm, rowsToCsv } from '../lib/projectForm.js';
import { EMPTY_FORM, SAMPLE_DATASETS, buildProjectBody, validateForm, num } from '../views/setup/formModel.js';
import AppHeader from '../views/AppHeader.jsx';
import Hero from '../views/Hero.jsx';
import TutorialModal from '../views/TutorialModal.jsx';
import KeyGate from '../views/KeyGate.jsx';
import SetupWizard from '../views/SetupWizard.jsx';
import RunDashboard from '../views/RunDashboard.jsx';
import Deliverable from '../views/Deliverable.jsx';
import Explorer from '../views/Explorer.jsx';
import ProjectPicker from '../views/run/ProjectPicker.jsx';
import RunBanner from '../views/run/RunBanner.jsx';
import { deriveRunPhase } from '../lib/runState.js';
import { Callout } from '../ui/index.js';

const POLL_MS = 3000;

/**
 * Orchestrator: owns project/run state and wires the setup wizard, key gate,
 * run dashboard, snippet deliverable and explorer. No engine logic lives here.
 */
export default function DatasetLearningV2() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [csvText, setCsvText] = useState('');
  const [numEpochs, setNumEpochs] = useState(2);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [anyRunning, setAnyRunning] = useState(false);
  const [runControl, setRunControl] = useState({ state: 'running', inFlight: 0 });
  const [runTargets, setRunTargets] = useState({}); // projectId -> target epoch
  const [view, setView] = useState('setup'); // 'setup' | 'run'
  const [step, setStep] = useState('start'); // wizard step
  const [savedSig, setSavedSig] = useState('');
  const [keyReady, setKeyReady] = useState(() => { try { return hasApiKey(); } catch { return false; } });
  const [keyOpen, setKeyOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(() => !getJSON(KEYS.tutorialSeen, false));

  const busyRef = useRef(false);
  const lastUploaded = useRef('');
  const lastEpochCount = useRef(-1);
  const wasRunning = useRef(false);
  const projectIdRef = useRef('');
  const projectsRef = useRef([]);
  projectIdRef.current = projectId;
  projectsRef.current = projects;

  const sigOf = (f, c) => JSON.stringify([f, c]);

  const refreshProjects = useCallback(async () => {
    const res = await fetchDatasetLearningV2Projects();
    if (res.ok) setProjects(res.projects || []);
    else setError(res.error || 'failed to list projects');
    return res.ok ? res.projects || [] : [];
  }, []);

  const loadProject = useCallback(async (id) => {
    if (!id) return null;
    const res = await fetchDatasetLearningV2Project(id);
    if (projectIdRef.current !== id) return null; // switched away while loading
    if (!res.ok) { setError(res.error || 'failed to load project'); return null; }
    setStatus(res);
    const nowRunning = apiIsRunning(id);
    setRunning(nowRunning);
    const count = (res.epochs || []).length;
    if (lastEpochCount.current !== -1 && count !== lastEpochCount.current) void flushDb();
    if (wasRunning.current && !nowRunning) void flushDb();
    wasRunning.current = nowRunning;
    lastEpochCount.current = count;
    return res;
  }, []);

  // Boot DB, flush on hide/close, restore last project.
  useEffect(() => {
    let alive = true;
    // Ask the browser not to evict saved projects under storage pressure.
    try { void navigator.storage?.persist?.(); } catch { /* ignore */ }
    initDb()
      .then(async () => {
        const list = await refreshProjects();
        if (!alive) return;
        const last = getJSON(KEYS.lastProject, '');
        if (last && list.some((p) => p.id === last)) selectProject(last, true);
        setReady(true);
      })
      .catch((err) => { setError(String(err?.message || err)); setReady(true); });
    const flush = () => { void flushDb(); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      alive = false;
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll the selected project every 3s.
  useEffect(() => {
    if (!projectId) return undefined;
    lastEpochCount.current = -1;
    wasRunning.current = false;
    void loadProject(projectId);
    const t = setInterval(() => { void loadProject(projectId); }, POLL_MS);
    return () => clearInterval(t);
  }, [projectId, loadProject]);

  // Track runs across ALL projects: a run keeps going after you switch away.
  useEffect(() => {
    const tick = () => { setRunControl(getRunControl()); setAnyRunning(projectsRef.current.some((p) => apiIsRunning(p.id)) || (!!projectIdRef.current && apiIsRunning(projectIdRef.current))); };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Leave-page guard while any run is in flight.
  useEffect(() => {
    if (!anyRunning && !running) return undefined;
    const onBefore = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, [anyRunning, running]);

  // Load a stored project into the form/CSV so Setup can show and edit it.
  function hydrateFromStatus(res) {
    const f = projectToForm(res.project);
    const c = rowsToCsv(res.rows, res.project?.columns_json);
    setForm(f);
    setCsvText(c);
    setSavedSig(sigOf(f, c));
    lastUploaded.current = c;
  }

  async function selectProject(id, restoring = false) {
    if (!id) return;
    setError('');
    projectIdRef.current = id;
    setStatus(null);
    setProjectId(id);
    setJSON(KEYS.lastProject, id);
    const res = await fetchDatasetLearningV2Project(id);
    if (projectIdRef.current !== id) return;
    if (!res.ok) { setError(res.error || 'failed to load project'); return; }
    hydrateFromStatus(res);
    const hasData = (res.rows || []).length > 0;
    setView(hasData ? 'run' : 'setup');
    setStep(hasData ? 'review' : 'data');
    void restoring;
  }

  function newProject() {
    projectIdRef.current = '';
    setProjectId('');
    setStatus(null);
    setForm(EMPTY_FORM);
    setCsvText('');
    setSavedSig('');
    lastUploaded.current = '';
    setError('');
    setRunning(false); // no project is selected; other projects' runs are tracked by anyRunning
    setView('setup');
    setStep('start');
  }

  /** "FrontierScience demo", then "FrontierScience demo 2", ... */
  function uniqueDemoTitle(base) {
    const taken = new Set(projectsRef.current.map((p) => p.title));
    if (!taken.has(base)) return base;
    for (let i = 2; ; i++) {
      const candidate = `${base} ${i}`;
      if (!taken.has(candidate)) return candidate;
    }
  }

  /** One-click preset (original createDemoFromPreset flow). Does NOT start the run. Returns false on failure. */
  async function onPreset(key) {
    const sample = SAMPLE_DATASETS[key];
    if (!sample || busyRef.current) return false;
    busyRef.current = true;
    setBusy(`Creating ${sample.label}…`);
    setError('');
    try {
      const response = await fetch(new URL(`data/${sample.file}`, document.baseURI));
      if (!response.ok) throw new Error(`Could not load ${sample.file} (HTTP ${response.status})`);
      const text = await response.text();
      if (!text.trim()) throw new Error(`${sample.file} is empty`);

      const fields = { ...EMPTY_FORM, ...sample.fields, title: uniqueDemoTitle(sample.title) };
      const created = await createDatasetLearningV2Project(buildProjectBody(fields));
      if (!created.ok) throw new Error(created.error || 'create failed');
      const uploaded = await uploadDatasetV2Csv(created.project.id, text);
      if (!uploaded.ok) throw new Error(uploaded.error || 'upload failed');

      setForm(fields);
      setCsvText(text);
      setSavedSig(sigOf(fields, text));
      lastUploaded.current = text;
      setStatus(null);
      projectIdRef.current = created.project.id;
      setProjectId(created.project.id);
      setJSON(KEYS.lastProject, created.project.id);
      await refreshProjects();
      await loadProject(created.project.id);
      setView('setup');
      setStep('review');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      busyRef.current = false;
      setBusy('');
    }
  }

  /** Create or update the project, then upload the CSV when it changed. */
  async function onCreateOrUpdate() {
    if (busyRef.current) return;
    const v = validateForm(form, parseCsvPreview(csvText));
    if (v.errors.length) { setError(v.errors[0].message); return; }
    busyRef.current = true;
    setError('');
    try {
      let id = projectId;
      const hadRows = (status?.rows || []).length > 0;
      const csvChanged = !hadRows || csvText !== lastUploaded.current;
      if (!id) {
        setBusy('Creating project…');
        const res = await createDatasetLearningV2Project(buildProjectBody(form));
        if (!res.ok) throw new Error(res.error || 'create failed');
        id = res.project.id;
        projectIdRef.current = id;
        setProjectId(id);
        setJSON(KEYS.lastProject, id);
      } else {
        setBusy('Saving project…');
        const body = buildProjectBody(form);
        const res = await configureDatasetV2Project(id, body);
        if (!res.ok) throw new Error(res.error || 'update failed');
      }
      if (csvChanged) {
        setBusy('Uploading CSV…');
        const up = await uploadDatasetV2Csv(id, csvText);
        if (!up.ok) throw new Error(up.error || 'upload failed');
        lastUploaded.current = csvText;
      }
      await refreshProjects();
      await loadProject(id);
      setSavedSig(sigOf(form, csvText));
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      busyRef.current = false;
      setBusy('');
    }
  }

  /** Start (or continue) the epoch loop. Resume carries the trailing-rejection count into the engine. */
  async function startRun() {
    if (!projectId || busyRef.current || running || anyRunning) return;
    if (!hasApiKey()) { setKeyOpen(true); return; }
    busyRef.current = true;
    setBusy('Starting run…');
    setError('');
    try {
      const epochsDone = status?.epochs || [];
      const n = Math.max(1, num(numEpochs, 1));
      const res = await startDatasetLearningV2(projectId, n, { consecutiveRejections: trailingRejections(epochsDone) });
      if (!res.ok) { setError(res.error || 'start failed'); return; }
      const last = epochsDone.length ? epochsDone[epochsDone.length - 1].epoch : 0;
      setRunTargets((m) => ({ ...m, [projectId]: last + n }));
      setRunning(true);
      setAnyRunning(true);
      wasRunning.current = true;
      setView('run');
      await loadProject(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      busyRef.current = false;
      setBusy('');
    }
  }

  function pauseCurrentRun() {
    pauseRun();
    setRunControl(getRunControl());
  }

  function unpauseCurrentRun() {
    resumeRun();
    setRunControl(getRunControl());
  }

  function stopCurrentRun() {
    if (!window.confirm('Stop the run? The unfinished epoch is discarded. Finished epochs and accepted rules are kept.')) return;
    stopRun();
    setRunControl(getRunControl());
  }

  function saveKey(k) {
    setApiKey(k);
    setKeyReady(hasApiKey());
  }

  function closeGuide({ dismissForever } = {}) {
    if (dismissForever) setJSON(KEYS.tutorialSeen, true);
    setGuideOpen(false);
  }

  // --- derived ---
  const hasRows = (status?.rows || []).length > 0;
  const taxonomyCount = (status?.taxonomy || []).length;
  const openEnded = !!status?.project?.open_ended;
  const problems = useMemo(() => validateForm(form, parseCsvPreview(csvText)), [form, csvText]);
  const dirty = !!projectId && savedSig !== '' && savedSig !== sigOf(form, csvText);
  let startDisabledReason = '';
  if (!projectId) startDisabledReason = 'Save the project first.';
  else if (dirty) startDisabledReason = 'You changed the setup. Update the project first.';
  else if (!hasRows) startDisabledReason = 'No rows loaded yet.';
  else if (running) startDisabledReason = 'A run is already in progress.';
  else if (anyRunning) startDisabledReason = 'Another project is still running in this tab. Wait for it to finish.';
  else if (busy) startDisabledReason = busy;
  const canStart = !startDisabledReason && problems.errors.length === 0;

  const epochCount = (status?.epochs || []).length;
  const current = view === 'run' ? 3 : step === 'prompt' || step === 'review' ? 2 : 1;
  const done = [];
  if (hasRows) done.push(1, 2);
  if (epochCount > 0) done.push(3);
  if (taxonomyCount > 0 && epochCount > 0) done.push(4);
  const reachable = [1, 2];
  if (hasRows) reachable.push(3);
  if (taxonomyCount > 0) reachable.push(4);

  function onStep(n) {
    if (n === 1) { setView('setup'); setStep(projectId ? 'data' : 'start'); }
    else if (n === 2) { setView('setup'); setStep(projectId ? 'review' : 'data'); }
    else {
      setView('run');
      if (n === 4) setTimeout(() => document.getElementById('pf-snippet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  const epochCounts = useMemo(() => (projectId && status ? { [projectId]: epochCount } : {}), [projectId, status, epochCount]);
  const showHero = ready && view === 'setup' && step === 'start' && projects.length === 0 && !projectId;
  const err = error ? friendlyError(error) : null;

  // A run keeps going while you browse other steps, so surface it everywhere but the Run view.
  const runningId = (projectId && apiIsRunning(projectId)) ? projectId : (projects.find((p) => apiIsRunning(p.id))?.id || null);
  let runBanner = null;
  if (runningId && view !== 'run') {
    const here = runningId === projectId;
    const done = status?.epochs || [];
    const phase = here ? deriveRunPhase(status?.log, done, true) : null;
    const lastDone = done.length ? done[done.length - 1].epoch : 0;
    const target = runTargets[runningId];
    const name = projects.find((p) => p.id === runningId)?.name;
    const label = here
      ? `${name ? `${name}: ` : ''}Epoch ${Math.max(phase.epoch || 0, lastDone)}${target ? ` of ${target}` : ''}, ${phase.label.toLowerCase()}`
      : `${name || 'Another project'} is running in this tab`;
    runBanner = (
      <RunBanner
        label={label}
        paused={runControl.state === 'paused'}
        onView={() => { if (!here) selectProject(runningId); setView('run'); }}
        onPause={pauseCurrentRun}
        onUnpause={unpauseCurrentRun}
        onStop={stopCurrentRun}
      />
    );
  }

  return (
    <>
      <AppHeader banner={runBanner} runActive={!!runningId} current={current} done={done} reachable={reachable} onStep={onStep} hasKey={keyReady} onOpenKey={() => setKeyOpen(true)} onOpenGuide={() => setGuideOpen(true)}>
        {projects.length > 0 && view === 'setup' ? (
          <ProjectPicker projects={projects} projectId={projectId || undefined} epochCounts={epochCounts} onSelectProject={(id) => selectProject(id)} onNewProject={newProject} />
        ) : null}
      </AppHeader>

      <main className="pf-container pf-main">
        {showHero ? (
          <Hero hasKey={keyReady} hasCsv={!!csvText} onOpenKey={() => setKeyOpen(true)}
            onPreset={() => document.getElementById('pf-setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            onUseOwn={() => { setStep('data'); }} />
        ) : null}

        {error && view === 'run' ? (
          <Callout tone="error" title={err?.title}>
            {err?.hint} <span className="pf-mono">{error}</span>
          </Callout>
        ) : null}

        {view === 'setup' ? (
          <div id="pf-setup">
            <SetupWizard
              key={projectId || 'new'}
              form={form}
              onFormChange={setForm}
              csvText={csvText}
              onCsvChange={(t) => setCsvText(t)}
              keyReady={keyReady}
              onOpenKeyGate={() => setKeyOpen(true)}
              busy={busy}
              error={error}
              projectExists={!!projectId}
              onPreset={onPreset}
              onCreateOrUpdate={onCreateOrUpdate}
              numEpochs={numEpochs}
              onNumEpochs={setNumEpochs}
              onStart={() => { void startRun(); }}
              canStart={canStart}
              startDisabledReason={startDisabledReason}
              step={step}
              onStepChange={setStep}
            />
            {projectId && hasRows ? (
              <p className="pf-hint">
                <button type="button" className="pf-btn" onClick={() => setView('run')}>Go to run dashboard</button>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="pf-stack">
            <RunDashboard
              status={status}
              isRunning={running}
              numEpochs={numEpochs}
              onNumEpochs={setNumEpochs}
              onStart={() => { void startRun(); }}
              onResume={() => { void startRun(); }}
              keyReady={keyReady}
              onOpenKeyGate={() => setKeyOpen(true)}
              projects={projects}
              projectId={projectId}
              onSelectProject={(id) => selectProject(id)}
              onNewProject={newProject}
              epochCounts={epochCounts}
              runTarget={running ? runTargets[projectId] : undefined}
              paused={running && runControl.state === 'paused'}
              pausing={runControl.inFlight > 0}
              onPause={pauseCurrentRun}
              onUnpause={unpauseCurrentRun}
              onStop={stopCurrentRun}
            />
            <div id="pf-snippet">
              <Deliverable status={status} isRunning={running} openEnded={openEnded} onJumpToRun={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            </div>
            <Explorer status={status} isRunning={running} openEnded={openEnded} onJumpToRun={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <p className="pf-hint"><button type="button" className="pf-btn" onClick={() => { setView('setup'); setStep('review'); }}>Edit setup</button></p>
          </div>
        )}
      </main>

      <TutorialModal open={guideOpen} onClose={closeGuide} />
      <KeyGate
        open={keyOpen}
        apiKey={getApiKey()}
        model={getModel()}
        onSaveKey={saveKey}
        onModelChange={(m) => setModel(m)}
        onClose={() => { setKeyOpen(false); setKeyReady(hasApiKey()); }}
      />
    </>
  );
}
