import React, { useEffect, useRef, useState } from 'react';
import { Button, Icon } from '../../ui/index.js';
import '../../styles/run.css';

/**
 * Project dropdown: a button that opens a styled listbox (not a native <select>).
 * Props:
 *  - projects: [{id, title, ...}]   (fetchDatasetLearningV2Projects().projects)
 *  - projectId: current id
 *  - epochCounts?: {[projectId]: number}  optional, shown on each item
 *  - onSelectProject(id), onNewProject()
 * Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter picks, Esc or Tab closes.
 */
const NEW = '__new__';

function projectLabel(p) {
  return p.title || `Untitled ${String(p.id).slice(0, 6)}`;
}

export function ProjectPicker({ projects = [], projectId, epochCounts = {}, onSelectProject, onNewProject }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  const items = [...projects.map((p) => ({ id: p.id, label: projectLabel(p), epochs: epochCounts[p.id] })), { id: NEW, label: '+ New project' }];
  const current = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function openMenu() {
    const i = items.findIndex((it) => it.id === projectId);
    setActive(i >= 0 ? i : 0);
    setOpen(true);
  }

  function pick(item) {
    setOpen(false);
    buttonRef.current?.focus();
    if (item.id === NEW) onNewProject?.();
    else if (item.id !== projectId) onSelectProject?.(item.id);
  }

  function onKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMenu(); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + items.length) % items.length); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(items.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(items[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'Tab') setOpen(false);
  }

  return (
    <div className="pf-run-picker" ref={rootRef}>
      <span className="pf-label" id="pf-run-project-label">Project</span>
      <div className="pf-row">
        <div className="pf-dropdown">
          <button
            ref={buttonRef}
            type="button"
            className="pf-dropdown-btn"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-labelledby="pf-run-project-label pf-run-project-value"
            aria-controls="pf-run-project-list"
            onClick={() => (open ? setOpen(false) : openMenu())}
            onKeyDown={onKeyDown}
          >
            <span id="pf-run-project-value" className="pf-dropdown-value">
              {current ? projectLabel(current) : 'Select a project'}
              {current && epochCounts[current.id] != null && (
                <span className="pf-dropdown-meta">{epochCounts[current.id]} epoch{epochCounts[current.id] === 1 ? '' : 's'}</span>
              )}
            </span>
            <Icon name="chevron-down" size={14} className={`pf-dropdown-caret${open ? ' is-open' : ''}`} />
          </button>
          {open && (
            <ul
              id="pf-run-project-list"
              className="pf-dropdown-menu"
              role="listbox"
              aria-labelledby="pf-run-project-label"
              aria-activedescendant={`pf-run-project-opt-${active}`}
            >
              {items.map((it, i) => (
                <li
                  key={it.id}
                  id={`pf-run-project-opt-${i}`}
                  role="option"
                  aria-selected={it.id === projectId}
                  className={`pf-dropdown-item${i === active ? ' is-active' : ''}${it.id === projectId ? ' is-selected' : ''}${it.id === NEW ? ' is-new' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(it)}
                >
                  <span className="pf-dropdown-item-label">{it.label}</span>
                  {it.epochs != null && <span className="pf-dropdown-meta">{it.epochs} epoch{it.epochs === 1 ? '' : 's'}</span>}
                  {it.id === projectId && <Icon name="check" size={14} />}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button size="sm" onClick={() => onNewProject?.()}>New</Button>
      </div>
    </div>
  );
}
export default ProjectPicker;
