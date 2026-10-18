# Procept RSI UI kit

Plain React 18 + plain CSS (`src/styles/ui.css`, loaded after `theme.css`). One component per file, named export + default. Barrel: `import { Button, Panel, ... } from '../ui/index.js'`. Class prefix `pf-`. Square corners (3px), no pills, no shadows (glow only on status dots), accent used once per section.

## Components (src/ui)
- **Button** `{variant:'default'|'primary'|'ghost', size:'md'|'sm'|'lg', icon?:IconName, loading?, block?, filled?, ...button props}`. One primary per view; `filled` gives solid term-400 (use for Start).
- **Panel** `{title?, actions?, footer?, bare?, as?, className}` header row + padded body (`bare` = no body padding, e.g. for tables).
- **SectionHeading** `{num, label, title(ReactNode, use <em>word</em>), sub, small?, as?}` renders kicker "01 / LABEL" + light display heading + sub.
- **StatusChip** `{tone:'live'|'ok'|'warn'|'error'|'idle', pulse?}` children = text. `live` pulses by default.
- **Field** `{label, help, error, htmlFor, className}` wraps a control; give the control `id={htmlFor}`; help/error get ids `${htmlFor}-help` / `-error`.
- **Callout** `{tone:'info'|'warn'|'error'|'ok', title?, actions?}` children body. warn/error use role=alert.
- **Modal** `{open=true, onClose, title, footer?, wide?, dismissible=true}` portal, focus trap, Esc, backdrop click, restores focus, locks scroll. `dismissible=false` for a hard gate.
- **Accordion** `{title, defaultOpen?, open?, onToggle?(next)}`.
- **Stat** `{label, value, delta?, deltaTone?:'up'|'down'}` numeric delta auto-colours.
- **CopyButton** `{text|()=>string, label='Copy', copiedLabel='Copied', size, variant}`; also exports `copyToClipboard(text)->Promise<boolean>`.
- **Icon** `{name, size=16, title?}` names (`ICON_NAMES`): check x key play pause copy download upload book arrow-right arrow-left alert info refresh file chevron-down sparkle spinner (spinner rotates).

## CSS classes (no component; use directly)
Layout: `pf-container` (max 72rem, 24px/64px gutter), `pf-grid` + `pf-grid-2|pf-grid-3` (md) / `pf-grid-main` (lg, 3fr/2fr), `pf-stack`, `pf-row`, `pf-spacer`, `pf-muted`, `pf-mono`, `pf-sr-only`.
Type: `pf-kicker`, `pf-heading` (+`pf-heading-sm`), `pf-sub`, `pf-help`, `pf-error`, `pf-label`.
Forms: `pf-input`, `pf-textarea`, `pf-select`, `pf-fieldset` + `pf-legend`, `pf-input-group`; set `aria-invalid="true"` for error border.
Chips: `pf-chip pf-chip-{live,ok,warn,error}` with `<span class="pf-dot [pf-dot-pulse]">`.
Stepper (wizard): `<ol class="pf-stepper"><li class="pf-step is-done|is-current"><span class="pf-step-num">1</span><span class="pf-step-label">Data</span></li>` (use `<button class="pf-step">` for clickable). Numeric stepper: `<div class="pf-count"><button/><output/><button/></div>`.
Choice cards: `<label class="pf-card-choice"><input type="radio" .../><span class="pf-card-title"/><span class="pf-card-desc"/></label>` (selected via :has(:checked) or `.is-selected`), or `<button class="pf-card-choice">` for presets; `pf-card-tag` for mono tag.
Table: `<div class="pf-table-wrap"><table class="pf-table">`. Progress: `<div class="pf-progress"><span style="width:40%"/></div>`. Code block: `pf-code`. Dropzone: `pf-dropzone` (+`is-over`). Modal inner: `pf-modal-body`, `pf-modal-foot`.
Tokens (`:root`): `--ink-950/900/850/800`, `--term-300/400/500/950`, `--accent-blue`, `--text`, `--text-2`, `--text-3`, `--text-3-aa` (use for readable tertiary), `--border`, `--border-soft`, `--err`, `--warn-c`, `--gutter`, `--radius`, `--dur`. Legacy `--accent`, `--bg*`, `--line` still exist.

## lib (src/lib)
- `csvPreview.js`: `parseCsvPreview(text,{maxRows=5}) -> {columns, rows, rowCount, warnings, empty}` (also default export). UI preview only.
- `snippet.js`: `SNIPPET_HEADER`, `CITATION_LINE`, `buildSnippet(taxonomy,{includeCitation=false}) -> string` ('' if no rules), `downloadText(filename,text,mime?)`.
- `estimate.js`: `estimateRun({rowCount,holdoutPct=0.2,openEnded,epochs}) -> {trainRows,holdoutRows,approxCalls,approxMinutes}`.
- `runState.js`: `lastErrorFromLog(log)->string|null`, `errorIsLatest(log)->bool`, `friendlyError(msg)->{kind:'auth'|'credits'|'rate'|'network'|'other',title,hint}`, `trailingRejections(epochs)->number`, `deriveRunPhase(log,epochs,isRunning)->{key,label,epoch}` (keys: idle starting baseline training gating decided restart error interrupted done), `bestMetric(epochs,openEnded)->{value,epoch}|null`.
- `storage.js`: `KEYS.{tutorialSeen,lastProject}`, `getJSON(key,fallback)`, `setJSON(key,value)->bool`, `removeKey(key)`; all try/catch.

## api.js additions (src/api.js)
- `mapProject` now includes `sample_answer_column`; `configureDatasetV2Project` accepts `sample_answer_column`.
- `startDatasetLearningV2(projectId, numEpochs, opts?)`: `opts.consecutiveRejections` (int >= 0) forwarded to `engine.runAll`; nothing else.
- `isRunning(projectId) -> boolean` (this tab's in-flight loop).
- `testOpenRouterKey(key) -> Promise<{ok, label?, usage?, limit?, error?}>` never throws.
- Existing: `getApiKey/setApiKey/hasApiKey/getModel/setModel/getBaseUrl/setBaseUrl`, `initDb`, `flushDb`, fetch/create/upload/configure/start/delete project fns.
