# Explorer props
`<Explorer status isRunning openEnded onJumpToRun />`
- `status`: fetch-project result (`rows`, `rowHistory`, `epochs`, `log`) or null.
- `isRunning`, `openEnded`: bool. `onJumpToRun`: optional, renders "Back to run" link.
Collapsed by default (Accordion "Under the hood"). Contains RowHistory (row carousel, epoch range, jump-to-row), EpochMeta (epoch carousel, EditBadge), full log. Sub-components take `{status}` only.
