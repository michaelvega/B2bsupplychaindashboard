# RunDashboard props
Pure display; orchestrator polls `fetchDatasetLearningV2Project` and passes the result.

- `status` object from fetchDatasetLearningV2Project (project, epochs, taxonomy, taxonomyEpoch, rows, log)
- `isRunning` bool (api.isRunning)
- `numEpochs` / `onNumEpochs(n)` number of ADDITIONAL epochs to run (engine runAll semantics); clamped 1..50
- `onStart()` fresh start; `onResume()` continue (orchestrator should pass `{consecutiveRejections: trailingRejections(epochs)}` to startDatasetLearningV2)
- `keyReady` bool; `onOpenKeyGate()` opens key modal (also the "Fix key" action on 401 errors)
- `projects` [{id,title}], `projectId`, `onSelectProject(id)`, `onNewProject()`
- optional: `epochCounts` {id: n} for the picker; `runTarget` absolute last epoch for "Epoch X of N" (e.g. epochsAtStart + numEpochs); `prevRuleIds` for NEW highlight (else internal diff)

Sub-components (src/views/run/): ProgressPanel {status,isRunning,runTarget,onFixKey}, MetricChart {epochs,openEnded}, TaxonomyPanel {taxonomy,taxonomyEpoch,prevRuleIds}, RunControls {isRunning,keyReady,hasRows,numEpochs,onNumEpochs,epochCount,interrupted,onStart,onResume,onOpenKeyGate}, LiveLog {log}, ProjectPicker {projects,projectId,epochCounts,onSelectProject,onNewProject}.
Repairs/regressions read `metrics.repairs` / `metrics.regressions` of the latest epoch (shows an en dash if absent).
