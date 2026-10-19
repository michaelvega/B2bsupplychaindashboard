/** Header line the engine's student prompt puts above the numbered rules (prompts.js buildStudentSystemPrompt). */
export const SNIPPET_HEADER = 'Generalizable inductive rules (cite these by number):';

/** Copied verbatim from buildCitationInstruction() in src/dataset-learning-v2/prompts.js. Do not import. */
export const CITATION_LINE = 'After answering, include a "cited_rules" array of the rule number(s) you used (e.g. {"cited_rules":[1,3]}). If you used none, use [].';

/** taxonomy: [{rule_id, text}] -> header + "\n" + "N. text" lines (same as engine buildTaxonomyText). '' if empty. */
export function buildSnippet(taxonomy, { includeCitation = false } = {}) {
  if (!Array.isArray(taxonomy) || taxonomy.length === 0) return '';
  const body = taxonomy.map((r) => `${r.rule_id}. ${r.text}`).join('\n');
  let out = `${SNIPPET_HEADER}\n${body}`;
  if (includeCitation) out += `\n\n${CITATION_LINE}`;
  return out;
}

/** Triggers a browser download of `text` as a file. */
export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.style.display = 'none';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
