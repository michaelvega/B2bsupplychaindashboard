import React, { useRef, useState } from 'react';
import { Button, Callout, Field, Icon } from '../../ui/index.js';

/**
 * Props:
 *  - csvText: string
 *  - onCsvChange(text: string, fileName?: string)
 *  - csvPreview: result of parseCsvPreview(csvText)
 *  - problems: { errors:[{field,message}], warnings:[string] } from validateForm
 *  - fileName: string  (last loaded file name, display only)
 */
export function DataStep({ csvText, onCsvChange, csvPreview, problems, fileName = '' }) {
  const [over, setOver] = useState(false);
  const [paste, setPaste] = useState(false);
  const [readError, setReadError] = useState('');
  const inputRef = useRef(null);

  function readFile(file) {
    if (!file) return;
    setReadError('');
    const reader = new FileReader();
    reader.onload = () => onCsvChange(String(reader.result ?? ''), file.name);
    reader.onerror = () => setReadError('Could not read that file.');
    reader.readAsText(file);
  }
  function onDrop(e) {
    e.preventDefault();
    setOver(false);
    readFile(e.dataTransfer.files?.[0]);
  }
  const has = !!csvText.trim();
  const csvErrors = problems.errors.filter((e) => e.field === 'csv');
  const items = [
    ...csvErrors.map((e) => ({ tone: 'err', text: e.message })),
    ...(has ? problems.warnings.map((w) => ({ tone: 'warn', text: w })) : []),
  ];

  return (
    <div className="pf-stack">
      <div
        className={`pf-dropzone${over ? ' is-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <p style={{ margin: '0 0 12px' }}>{has ? (fileName || 'CSV loaded') : 'Drop a CSV here'}</p>
        <div className="pf-row" style={{ justifyContent: 'center' }}>
          <Button icon="upload" onClick={() => inputRef.current?.click()}>Browse file</Button>
          <Button variant="ghost" onClick={() => setPaste((p) => !p)} aria-expanded={paste}>{paste ? 'Hide paste box' : 'Paste CSV text'}</Button>
        </div>
        <input ref={inputRef} type="file" accept=".csv,text/csv,text/plain" className="pf-sr-only" aria-label="Choose CSV file" tabIndex={-1} onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      {readError ? <Callout tone="error">{readError}</Callout> : null}

      {paste || (has && !fileName) ? (
        <Field label="CSV text" htmlFor="sw-csv-text" help="First row = column names. Comma separated.">
          <textarea id="sw-csv-text" className="pf-textarea sw-textarea-mono" rows={8} value={csvText} onChange={(e) => onCsvChange(e.target.value, '')} spellCheck={false} />
        </Field>
      ) : null}

      <div aria-live="polite">
        {items.length ? (
          <ul className="sw-problems">
            {items.map((it, i) => (
              <li key={i} className={it.tone === 'err' ? 'is-err' : 'is-warn'}>
                <Icon name={it.tone === 'err' ? 'alert' : 'info'} size={14} /> <span>{it.text}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {has && !csvPreview.empty && csvPreview.columns.length ? (
        <div className="pf-stack">
          <p className="pf-help" style={{ margin: 0 }}>
            Detected <strong>{csvPreview.columns.length}</strong> columns and <strong>{csvPreview.rowCount}</strong> rows. First {csvPreview.rows.length} shown.
          </p>
          <div className="pf-table-wrap sw-preview">
            <table className="pf-table">
              <thead><tr>{csvPreview.columns.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {csvPreview.rows.map((r, ri) => (
                  <tr key={ri}>{r.map((cell, ci) => <td key={ci} title={cell}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default DataStep;
