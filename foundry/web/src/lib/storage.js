/** Safe localStorage JSON helpers. Never throw. */
export const KEYS = {
  tutorialSeen: 'procept-foundry.tutorialSeen',
  lastProject: 'procept-foundry.lastProject',
};

export function getJSON(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}

/** -> boolean success */
export function setJSON(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export function removeKey(key) {
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}
