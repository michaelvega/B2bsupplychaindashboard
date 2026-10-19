/**
 * UI-only CSV preview helper (RFC4180-ish). The engine does the real parse and dedupe.
 * parseCsvPreview(text, {maxRows}) -> { columns: string[], rows: string[][], rowCount, warnings: string[], empty: boolean }
 * `rows` holds at most maxRows (default 5) data rows, normalised to columns.length.
 * `rowCount` counts ALL non-blank data rows.
 */
export function parseCsvPreview(text, { maxRows = 5 } = {}) {
  const warnings = [];
  let src = typeof text === 'string' ? text : '';
  if (src.charCodeAt(0) === 0xfeff) src = src.slice(1);
  if (!src.trim()) return { columns: [], rows: [], rowCount: 0, warnings: ['The file is empty.'], empty: true };

  const records = [];
  let rec = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"' && field === '') { inQuotes = true; i++; continue; }
    if (c === ',') { rec.push(field); field = ''; i++; continue; }
    if (c === '\r' || c === '\n') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      rec.push(field); field = ''; records.push(rec); rec = []; i++; continue;
    }
    field += c; i++;
  }
  if (inQuotes) warnings.push('A quoted field is never closed. Check for a stray quote character.');
  if (field !== '' || rec.length > 0) { rec.push(field); records.push(rec); }

  const isBlank = (r) => r.every((f) => f.trim() === '');
  const nonBlank = records.filter((r) => !isBlank(r));
  if (nonBlank.length === 0) return { columns: [], rows: [], rowCount: 0, warnings: ['The file is empty.'], empty: true };

  const columns = nonBlank[0].map((h) => h.trim());
  const dataRows = nonBlank.slice(1);
  if (columns.some((h) => h === '')) warnings.push('Some header cells are blank. The first row must be column names.');
  const seen = new Set();
  for (const h of columns) {
    if (h && seen.has(h)) { warnings.push(`Duplicate column name "${h}".`); break; }
    seen.add(h);
  }
  if (columns.length < 2) warnings.push('Only one column detected. Is the file comma-separated?');
  if (dataRows.length === 0) warnings.push('Header found but no data rows.');
  else if (dataRows.length < 20) warnings.push(`Only ${dataRows.length} row(s). Aim for 20 or more so the holdout split is meaningful.`);

  const ragged = dataRows.filter((r) => r.length !== columns.length).length;
  if (ragged > 0) warnings.push(`${ragged} row(s) have a different number of cells than the header.`);

  const rows = dataRows.slice(0, maxRows).map((r) => columns.map((_, idx) => r[idx] ?? ''));
  return { columns, rows, rowCount: dataRows.length, warnings, empty: false };
}
export default parseCsvPreview;
