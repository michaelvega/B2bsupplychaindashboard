import React from 'react';
import { Button, Icon } from '../../ui/index.js';
import { SAMPLE_DATASETS } from './formModel.js';

/**
 * Props:
 *  - onPreset(sampleKey: 'frontier'|'research')  start a preset (orchestrator creates + loads it)
 *  - onOwnData()                                  user chose "use my own data"
 *  - busy: string                                 non-empty while a preset is loading
 */
const CARDS = [
  { key: 'frontier', tag: 'Open-ended / rubric per row', title: 'FrontierScience', desc: 'Science questions with a grading rubric on every row. Free-form answers, graded point by point.' },
  { key: 'research', tag: 'Rubric per row / taxonomy prompt', title: 'ResearchRubrics', desc: 'Research tasks with a rubric per row. The prompt uses {{domain}} and {{taxonomy}} so learned rules flow in.' },
];

export function PresetCards({ onPreset, onOwnData, busy = '' }) {
  return (
    <div className="pf-stack">
      <div className="sw-presets">
        {CARDS.map((c) => (
          <button key={c.key} type="button" className="pf-card-choice" disabled={!!busy} onClick={() => onPreset(c.key)} aria-label={`Load ${SAMPLE_DATASETS[c.key].label}`}>
            <span className="pf-card-tag">{c.tag}</span>
            <span className="pf-card-title">{c.title}</span>
            <span className="pf-card-desc">{c.desc}</span>
            <span className="pf-help">Loads the sample, then jumps to review. Nothing runs until you press Start.</span>
          </button>
        ))}
      </div>
      <div className="sw-or" aria-hidden="true">or</div>
      <div>
        <Button variant="primary" size="lg" icon="arrow-right" onClick={onOwnData} disabled={!!busy}>Use my own data</Button>
      </div>
      {busy ? <p className="pf-help" role="status"><Icon name="spinner" size={12} /> {busy}</p> : null}
    </div>
  );
}
export default PresetCards;
