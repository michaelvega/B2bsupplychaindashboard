import React from 'react';
import { Button } from '../../ui/index.js';
import '../../styles/run.css';

const NEW = '__new__';
/**
 * Props:
 *  - projects: [{id, title, ...}]   (fetchDatasetLearningV2Projects().projects)
 *  - projectId: current id
 *  - epochCounts?: {[projectId]: number}  optional, shown in each option
 *  - onSelectProject(id), onNewProject()
 */
export function ProjectPicker({ projects = [], projectId, epochCounts = {}, onSelectProject, onNewProject }) {
  return (
    <div className="pf-run-picker">
      <label className="pf-label" htmlFor="pf-run-project">Project</label>
      <div className="pf-row">
        <select id="pf-run-project" className="pf-select" value={projectId ?? ''} onChange={(e) => (e.target.value === NEW ? onNewProject?.() : onSelectProject?.(e.target.value))}>
          {projects.map((p) => {
            const c = epochCounts[p.id];
            return <option key={p.id} value={p.id}>{(p.title || `Untitled ${String(p.id).slice(0, 6)}`) + (c != null ? ` · ${c} epoch${c === 1 ? '' : 's'}` : '')}</option>;
          })}
          <option value={NEW}>+ New project</option>
        </select>
        <Button size="sm" onClick={() => onNewProject?.()}>New</Button>
      </div>
    </div>
  );
}
export default ProjectPicker;
