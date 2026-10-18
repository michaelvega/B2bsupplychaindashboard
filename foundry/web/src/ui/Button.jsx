import React from 'react';
import Icon from './Icon.jsx';

/** variant: 'default'|'primary'|'ghost'; size: 'md'|'sm'|'lg'; icon: Icon name; loading shows spinner. */
export function Button({ variant = 'default', size = 'md', icon, loading = false, block = false, filled = false, className = '', children, disabled, type = 'button', ...rest }) {
  const cls = ['pf-btn', variant === 'primary' && 'pf-btn-primary', variant === 'primary' && filled && 'pf-btn-filled', variant === 'ghost' && 'pf-btn-ghost', size === 'sm' && 'pf-btn-sm', size === 'lg' && 'pf-btn-lg', block && 'pf-btn-block', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Icon name="spinner" size={14} /> : icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </button>
  );
}
export default Button;
