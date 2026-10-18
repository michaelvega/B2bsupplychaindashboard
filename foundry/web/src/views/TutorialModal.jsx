import React, { useEffect, useState } from 'react';
import { Modal, Button, Icon } from '../ui/index.js';
import '../styles/onboarding.css';

/**
 * First-visit / re-openable guide.
 * Props:
 *  - open: boolean
 *  - onClose({ dismissForever: boolean }): called on Skip, Esc, backdrop, close and Done.
 *      dismissForever is true when "Don't show again" is checked (default checked on first run via defaultDismiss).
 *  - defaultDismiss?: boolean (initial state of the checkbox, default true)
 */

const Box = ({ x, y, w = 56, h = 34, label, acc }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="2" className={acc ? 'pfo-svg-acc' : 'pfo-svg-stroke'} />
    <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" className={acc ? 'pfo-svg-text-acc' : 'pfo-svg-text'}>{label}</text>
  </g>
);
const Arrow = ({ x1, x2, y = 60 }) => (
  <g><line x1={x1} y1={y} x2={x2} y2={y} className="pfo-svg-stroke" /><polyline points={`${x2 - 4},${y - 3} ${x2},${y} ${x2 - 4},${y + 3}`} className="pfo-svg-stroke" /></g>
);
const Svg = ({ children, label }) => <svg viewBox="0 0 320 120" role="img" aria-label={label}>{children}</svg>;

const STEPS = [
  { kicker: '01 / WHAT IT IS', title: <>Fine-tune without the <em>GPUs</em>.</>,
    text: 'Procept RSI learns a short list of rules from your examples. No training run, no LoRA, no SFT. The result is plain text you paste into your system prompt.',
    diagram: <Svg label="CSV to rules to snippet"><Box x={20} y={43} label="CSV" /><Arrow x1={80} x2={115} /><Box x={120} y={43} w={80} label="RULES" acc /><Arrow x1={204} x2={239} /><Box x={244} y={43} label="SNIPPET" /></Svg> },
  { kicker: '02 / BRING DATA', title: <>Bring a <em>CSV</em>.</>,
    text: 'One row per example. You need an input column (the question or task) and a way to grade answers. 20 or more rows works best; 20% is held out to check the rules generalize.',
    diagram: <Svg label="CSV table"><rect x="60" y="20" width="200" height="80" rx="2" className="pfo-svg-stroke" /><line x1="60" y1="40" x2="260" y2="40" className="pfo-svg-stroke" /><line x1="140" y1="20" x2="140" y2="100" className="pfo-svg-stroke" /><text x="70" y="34" className="pfo-svg-text-acc">input</text><text x="150" y="34" className="pfo-svg-text-acc">rubric</text>{[56, 72, 88].map((y) => <g key={y}><rect x="70" y={y - 6} width="56" height="5" className="pfo-svg-fill" /><rect x="150" y={y - 6} width="90" height="5" className="pfo-svg-fill" /></g>)}</Svg> },
  { kicker: '03 / PICK GRADING', title: <>Say how answers are <em>graded</em>.</>,
    text: 'Exact answer column for short labels or numbers. A rubric per row for open-ended answers. Or one global rubric for every row. Free-form sample answers alone are not enough; add a short rubric.',
    diagram: <Svg label="Three grading modes"><Box x={20} y={43} w={84} label="EXACT ANSWER" /><Box x={118} y={43} w={84} label="ROW RUBRIC" acc /><Box x={216} y={43} w={84} label="GLOBAL RUBRIC" /></Svg> },
  { kicker: '04 / WATCH IT LEARN', title: <>Rules get <em>accepted</em> or rejected.</>,
    text: 'Each epoch the engine proposes edits, tests them on held-out rows, and keeps only what improves the score. Keep the tab open while it runs. Use a limited-credit key.',
    diagram: <Svg label="Metric rising across epochs"><polyline points="30,90 90,78 150,82 210,50 270,34" className="pfo-svg-acc" />{[[30, 90], [90, 78], [150, 82], [210, 50], [270, 34]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="var(--term-400)" />)}<text x="30" y="108" className="pfo-svg-text">epoch 0</text><text x="240" y="108" className="pfo-svg-text">epoch N</text></Svg> },
  { kicker: '05 / PASTE THE SNIPPET', title: <>Paste it. <em>Own</em> it.</>,
    text: 'When a rule is accepted, a numbered block appears. Copy it into your system prompt. It is text you own, so it works with any model.',
    diagram: <Svg label="Snippet pasted into a system prompt"><rect x="40" y="16" width="240" height="88" rx="2" className="pfo-svg-stroke" /><text x="52" y="32" className="pfo-svg-text">SYSTEM PROMPT</text><rect x="52" y="42" width="120" height="5" className="pfo-svg-fill" /><rect x="52" y="52" width="170" height="5" className="pfo-svg-fill" /><rect x="52" y="66" width="216" height="30" rx="2" className="pfo-svg-acc" /><text x="60" y="78" className="pfo-svg-text-acc">1. rule text</text><text x="60" y="90" className="pfo-svg-text-acc">2. rule text</text></Svg> },
];

export function TutorialModal({ open, onClose, defaultDismiss = true }) {
  const [i, setI] = useState(0);
  const [forever, setForever] = useState(defaultDismiss);
  const last = STEPS.length - 1;
  const s = STEPS[i];

  useEffect(() => { if (open) { setI(0); setForever(defaultDismiss); } }, [open, defaultDismiss]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      const t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'ArrowRight') setI((n) => Math.min(last, n + 1));
      else if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1));
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, last]);

  const close = () => onClose?.({ dismissForever: forever });

  return (
    <Modal open={open} onClose={close} title="Guide"
      footer={
        <div className="pfo-tut-foot">
          <label className="pfo-check"><input type="checkbox" checked={forever} onChange={(e) => setForever(e.target.checked)} /> Don&apos;t show again</label>
          <span className="pf-spacer" />
          {i < last ? <Button variant="ghost" size="sm" onClick={close}>Skip</Button> : null}
          {i > 0 ? <Button size="sm" icon="arrow-left" onClick={() => setI(i - 1)}>Back</Button> : null}
          {i < last ? <Button variant="primary" size="sm" onClick={() => setI(i + 1)}>Next</Button> : <Button variant="primary" size="sm" icon="check" onClick={close}>Done</Button>}
        </div>
      }>
      <div className="pfo-tut-diagram" aria-hidden="false">{s.diagram}</div>
      <div className="pf-kicker">{s.kicker}</div>
      <h3 className="pfo-tut-title">{s.title}</h3>
      <p className="pfo-tut-text" aria-live="polite">{s.text}</p>
      <div className="pfo-dots" role="group" aria-label={`Step ${i + 1} of ${STEPS.length}`} style={{ marginTop: 16 }}>
        {STEPS.map((_, n) => (
          <button key={n} type="button" className="pfo-dot-btn" aria-label={`Go to step ${n + 1}`} aria-current={n === i ? 'step' : undefined} onClick={() => setI(n)}><span /></button>
        ))}
      </div>
    </Modal>
  );
}
export default TutorialModal;
