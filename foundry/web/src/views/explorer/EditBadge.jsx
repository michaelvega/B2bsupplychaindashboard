import React from 'react';
import '../../styles/explorer.css';

/**
 * Meta-edit badge. Props: { edit: {op:'append'|'edit'|'combine', rule_id?, rule_ids?} }
 * Renders null for unknown ops.
 */
export function EditBadge({ edit }) {
  if (!edit || typeof edit !== 'object') return null;
  if (edit.op === 'append') return <span className="ex-badge ex-badge-ok">append</span>;
  if (edit.op === 'edit') return <span className="ex-badge">edit #{edit.rule_id}</span>;
  if (edit.op === 'combine') return <span className="ex-badge">combine [{String(edit.rule_ids).slice(0, 20)}]</span>;
  return null;
}
export default EditBadge;
