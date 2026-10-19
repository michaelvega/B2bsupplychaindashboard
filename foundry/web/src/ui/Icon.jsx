import React from 'react';

const P = {
  check: <path d="M4 12l5 5L20 6" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" /></>,
  play: <path d="M7 4l13 8-13 8z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  pencil: <path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4" />,
  stop: <path d="M6 6h12v12H6z" />,
  copy: <><rect x="9" y="9" width="11" height="11" /><path d="M5 15V5h10" /></>,
  download: <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />,
  upload: <path d="M12 15V3m0 0L7 8m5-5l5 5M4 21h16" />,
  book: <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M19 19v2H6" />,
  'arrow-right': <path d="M4 12h16m0 0l-6-6m6 6l-6 6" />,
  'arrow-left': <path d="M20 12H4m0 0l6-6m-6 6l6 6" />,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>,
  refresh: <path d="M20 11a8 8 0 00-14-4L4 9m0-5v5h5M4 13a8 8 0 0014 4l2-2m0 5v-5h-5" />,
  file: <path d="M6 3h8l5 5v13H6zM14 3v5h5" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  sparkle: <path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />,
  spinner: <path d="M12 3a9 9 0 019 9" />,
};

export const ICON_NAMES = Object.keys(P);

/** Inline SVG icon. name: one of ICON_NAMES. Decorative unless `title` is given. */
export function Icon({ name, size = 16, title, className = '', ...rest }) {
  const spin = name === 'spinner' ? ' pf-spin' : '';
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"
      className={`pf-icon${spin} ${className}`.trim()}
      role={title ? 'img' : undefined} aria-hidden={title ? undefined : 'true'}
      aria-label={title} focusable="false" {...rest}
    >
      {P[name] || null}
    </svg>
  );
}
export default Icon;
