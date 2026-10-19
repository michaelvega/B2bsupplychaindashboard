import React from 'react';

/** num: '01', label: 'DATA' => kicker "01 / DATA". title may contain <em>word</em>. */
export function SectionHeading({ num, label, title, sub, small = false, as: H = 'h2', className = '' }) {
  const kicker = [num, label].filter(Boolean).join(' / ');
  return (
    <header className={`pf-section-heading ${className}`.trim()}>
      {kicker ? <p className="pf-kicker">{kicker}</p> : null}
      {title ? <H className={`pf-heading${small ? ' pf-heading-sm' : ''}`}>{title}</H> : null}
      {sub ? <p className="pf-sub">{sub}</p> : null}
    </header>
  );
}
export default SectionHeading;
