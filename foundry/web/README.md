# Procept Foundry — Dataset Learning (web)

Vite + React single-page app for the static Dataset Learning demo. It contains
no server code: the engine runs in the browser and stores its SQLite database in
IndexedDB.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

Open the page, paste an OpenRouter API key into the field at the top of the left
panel, then create a project, upload a CSV, and start the epochs. The key is
stored in this browser's `localStorage` and sent only to OpenRouter.

## Build

```bash
npm run build      # emits dist/ (relative asset paths; works on GitHub Pages)
npm run preview    # serve dist/ locally
```

Deploy the contents of `dist/` to any static host, or use the GitHub Actions
workflow in `../.github/workflows/deploy.yml`.

## Architecture

- `src/pages/DatasetLearningV2.jsx` — the UI (the original dataset tab).
- `src/api.js` — in-browser adapter for the engine; no `fetch('/api/...')`.
- `src/App.jsx` — single-tool shell (no router, no sidebar).
- `vite.config.js` — swaps the engine's Node adapters for the browser ones and
  sets `base: './'`.

The shared engine lives one level up in `../src/dataset-learning-v2/`.
