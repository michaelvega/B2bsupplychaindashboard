# Deliverable props
`<Deliverable status isRunning openEnded onJumpToRun />`
- `status`: object from api fetch project (uses `taxonomy[{rule_id,text}]`, `epochs[{gate_passed,metrics}]`), or null.
- `isRunning`: bool, shows "still learning" banner.
- `openEnded`: bool, picks continuousAccuracy vs accuracy.
- `onJumpToRun`: optional callback for empty-state button.
Pure display; local state only for the citation toggle.
