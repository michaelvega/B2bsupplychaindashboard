import React from 'react';

/** Bordered panel. title/actions render the header row; footer optional. bodyClassName defaults to padded body; pass bare to skip padding. */
export function Panel({ title, actions, footer, bare = false, as: Tag = 'section', className = '', children, ...rest }) {
  return (
    <Tag className={`pf-panel ${className}`.trim()} {...rest}>
      {(title || actions) && (
        <div className="pf-panel-head">
          <h3 className="pf-panel-title">{title}</h3>
          {actions ? <div className="pf-row">{actions}</div> : null}
        </div>
      )}
      {bare ? children : <div className="pf-panel-body">{children}</div>}
      {footer ? <div className="pf-panel-foot">{footer}</div> : null}
    </Tag>
  );
}
export default Panel;
