import React from 'react';
import { Button, StatusChip } from '../ui/index.js';
import '../styles/onboarding.css';

/**
 * Sticky app header with brand, step indicator, key chip, Guide button.
 * Props:
 *  - current: 1|2|3|4  active step (1 Data, 2 Task, 3 Run, 4 Snippet)
 *  - done: number[]    steps shown as done (e.g. [1,2])
 *  - reachable: number[] steps that can be clicked (current is always shown as current)
 *  - onStep(n): step clicked
 *  - hasKey: boolean; keyBlocked?: boolean (unused styling hook); onOpenKey(): opens KeyGate
 *  - onOpenGuide(): opens TutorialModal
 *  - banner?: node shown under the steps (run-in-progress strip); runActive?: bool, confirms before sign out
 *  - children: project picker slot, rendered in a row under the brand line
 */
/** Clear the gate cookie, then return to the sign-in page. */
async function signOut(runActive) {
  if (runActive && !window.confirm('A run is in progress. Signing out ends it and discards the unfinished epoch. Sign out anyway?')) return;
  try {
    await fetch('/api/foundry-session', { method: 'DELETE' });
  } catch {
    // Offline or no gate in front (local dev): still leave the page.
  }
  window.location.replace('/foundry-login/');
}

const STEPS = [{ n: 1, label: 'Data' }, { n: 2, label: 'Task' }, { n: 3, label: 'Run' }, { n: 4, label: 'Snippet' }];

export function AppHeader({ current = 1, done = [], reachable = [], onStep, hasKey = false, onOpenKey, onOpenGuide, banner, runActive = false, children }) {
  return (
    <header className="pfo-header">
      <div className="pf-container">
        <div className="pfo-header-top">
          <div className="pfo-brand">
            <img className="pfo-logo" src="./procept-logo.jpeg" alt="" width="24" height="24" />
            <span className="pfo-brand-name">Procept <em>RSI</em></span>
          </div>
          <div className="pfo-header-actions">
            <button type="button" className="pfo-key-chip pf-chip" onClick={onOpenKey}
              style={undefined} aria-label={hasKey ? 'OpenRouter key saved. Change key' : 'No OpenRouter key. Add key'}>
              <span className={`pf-dot ${hasKey ? 'pf-dot-ok' : ''}`} style={hasKey ? { background: 'var(--term-400)', boxShadow: 'var(--glow)' } : { background: 'var(--warn-c)' }} aria-hidden="true" />
              {hasKey ? 'Key saved' : 'Add key'}
            </button>
            <Button size="sm" icon="book" onClick={onOpenGuide}>Guide</Button>
            <Button size="sm" variant="ghost" onClick={() => signOut(runActive)}>Sign out</Button>
          </div>
        </div>
        <nav className="pfo-header-steps" aria-label="Progress">
          <ol className="pf-stepper">
            {STEPS.map(({ n, label }) => {
              const isCur = n === current;
              const isDone = !isCur && done.includes(n);
              const cls = `pf-step${isCur ? ' is-current' : ''}${isDone ? ' is-done' : ''}`;
              const num = isDone ? '✓' : n;
              const inner = (<><span className="pf-step-num">{num}</span><span className="pf-step-label">{label}</span></>);
              const clickable = !isCur && reachable.includes(n);
              return (
                <li key={n} style={{ display: 'contents' }}>
                  {clickable
                    ? <button type="button" className={cls} onClick={() => onStep?.(n)}>{inner}</button>
                    : <span className={cls} aria-current={isCur ? 'step' : undefined}>{inner}</span>}
                </li>
              );
            })}
          </ol>
        </nav>
        {banner || null}
        {children ? <div className="pfo-header-slot">{children}</div> : null}
      </div>
    </header>
  );
}
export default AppHeader;
