import React from 'react';

/** Label + control + help/error. Pass htmlFor matching the child control id. Use aria-describedby ids `${htmlFor}-help` / `${htmlFor}-error`. */
export function Field({ label, help, error, htmlFor, className = '', children }) {
  return (
    <div className={`pf-field ${className}`.trim()}>
      {label ? <label className="pf-label" htmlFor={htmlFor}>{label}</label> : null}
      {children}
      {help ? <p className="pf-help" id={htmlFor ? `${htmlFor}-help` : undefined}>{help}</p> : null}
      {error ? <p className="pf-error" role="alert" id={htmlFor ? `${htmlFor}-error` : undefined}>{error}</p> : null}
    </div>
  );
}
export default Field;
