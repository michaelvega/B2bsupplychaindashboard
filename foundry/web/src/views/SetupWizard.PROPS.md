# SetupWizard props

Import: `import SetupWizard from './views/SetupWizard.jsx'`; form helpers in `views/setup/formModel.js`
(`EMPTY_FORM`, `SAMPLE_DATASETS`, `buildProjectBody(form)`, `validateForm(form, preview)`, `gradingOf`).

| prop | type | notes |
|---|---|---|
| form | object | shape of `EMPTY_FORM` (adds `sample_answer_column`, UI-only `input_columns[]`) |
| onFormChange | (nextForm) => void | receives the FULL next form object |
| csvText | string | |
| onCsvChange | (text, fileName?) => void | wizard also calls onFormChange right after to auto-fill columns/prompt/title |
| keyReady | boolean | |
| onOpenKeyGate | () => void | |
| busy | string | non-empty = working (message shown) |
| error | string | |
| projectExists | boolean | a project is already created for the current form |
| onPreset | (key 'frontier'\|'research') => Promise<boolean\|void> | return `false` on failure to stay on Start; otherwise wizard jumps to Review. Orchestrator creates project (buildProjectBody on `{...EMPTY_FORM, ...sample.fields, title}`), uploads CSV, sets form/csvText |
| onCreateOrUpdate | () => void | create project + upload CSV (use `buildProjectBody(form)`); the form's `input_columns` is not sent |
| numEpochs, onNumEpochs | string/number, (n:number) => void | default 2 |
| onStart | () => void | |
| canStart, startDisabledReason | boolean, string | parent readiness; wizard also blocks on key, validation errors and unsaved project |
| step, onStepChange | optional 'start'\|'data'\|'prompt'\|'review', (s) => void | optional controlled step |

Grading is derived from real engine fields (`gradingOf`): exact = open_ended false + golden_column; per_row = open_ended + rubric_mode per_row + rubric_column; global = open_ended + rubric_mode global + rubric_json. Optional `sample_answer_column` for open-ended modes.
