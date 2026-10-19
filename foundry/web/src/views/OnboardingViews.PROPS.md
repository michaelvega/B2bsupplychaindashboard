# Onboarding views: props

## TutorialModal `{open, onClose({dismissForever}), defaultDismiss=true}`
Persist `tutorialSeen` (lib/storage KEYS.tutorialSeen) when `dismissForever` is true. Esc/backdrop/Skip/Done all call onClose.

## KeyGate `{open, apiKey, onSaveKey(key), onClose, model, onModelChange(model), testKey?, dismissible=true}`
onSaveKey: parent calls api.setApiKey. onModelChange: parent calls api.setModel. Save also closes. Default testKey = api.testOpenRouterKey.

## AppHeader `{current:1-4, done:number[], reachable:number[], onStep(n), hasKey, onOpenKey, onOpenGuide, children}`
children = project picker slot. Steps: 1 Data, 2 Task, 3 Run, 4 Snippet.

## Hero `{hasKey, hasCsv, onPreset, onUseOwn, onOpenKey}`
Shown only on first visit / empty state. Styles: styles/onboarding.css (prefix pfo-).
