import React, { useEffect, useRef, useState } from 'react';
import { Panel } from '../../ui/index.js';
import '../../styles/run.css';

/**
 * Props:
 *  - taxonomy: [{rule_id, text}]   (status.taxonomy)
 *  - taxonomyEpoch: number         (status.taxonomyEpoch, accepted epoch)
 *  - prevRuleIds?: Array<number|string>  optional; if omitted an internal ref diff
 *    against the previous render's rule ids is used (rules new since last poll).
 */
export function TaxonomyPanel({ taxonomy = [], taxonomyEpoch = 0, prevRuleIds }) {
  const rules = Array.isArray(taxonomy) ? taxonomy : [];
  const seen = useRef(null);
  const [fresh, setFresh] = useState(() => new Set());
  const key = rules.map((r) => r.rule_id).join(',');
  useEffect(() => {
    const ids = rules.map((r) => String(r.rule_id));
    const base = prevRuleIds ? new Set(prevRuleIds.map(String)) : seen.current;
    // First non-empty population is a baseline, not "new".
    if (base && base.size > 0) setFresh(new Set(ids.filter((id) => !base.has(id))));
    else setFresh(new Set());
    seen.current = new Set(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, prevRuleIds]);

  return (
    <Panel title={`Live taxonomy · ${rules.length} rule${rules.length === 1 ? '' : 's'}`} actions={taxonomyEpoch ? <span className="pf-help">accepted epoch {taxonomyEpoch}</span> : null}>
      {rules.length === 0 ? (
        <p className="pf-help" style={{ margin: 0 }}>
          No rules yet. Rules appear after the first accepted epoch. Each epoch we study the rows the model got wrong, propose rules, and keep them only if they beat the holdout.
        </p>
      ) : (
        <ol className="pf-run-rules" aria-live="polite">
          {rules.map((r) => {
            const isNew = fresh.has(String(r.rule_id));
            return (
              <li key={r.rule_id} className={`pf-run-rule${isNew ? ' is-new' : ''}`}>
                <span className="pf-run-rule-num">{r.rule_id}.</span>
                <span>{r.text}{isNew && <span className="pf-run-new-tag">NEW</span>}</span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}
export default TaxonomyPanel;
