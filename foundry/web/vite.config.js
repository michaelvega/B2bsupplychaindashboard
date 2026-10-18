import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_DIR = path.resolve(__dirname, '../src/dataset-learning-v2');
const DATA_DIR = path.resolve(__dirname, '../data');

/**
 * The engine modules in `src/dataset-learning-v2/` are shared with the Node CLI
 * unchanged. Two of their dependencies are environment-specific:
 *
 *   ./db.js   -> node:sqlite + a local file
 *   ./llm.js  -> process.env + .env
 *
 * In the browser build we swap them for their browser adapters. The mapping is
 * scoped to imports that originate inside the engine directory so nothing else
 * is affected.
 */
function datasetLearningBrowserAdapters() {
  const adapters = {
    './db.js': path.resolve(__dirname, 'src/engine/db.browser.js'),
    './llm.js': path.resolve(__dirname, 'src/engine/llm.browser.js'),
  };
  const engineDir = path.resolve(ENGINE_DIR);

  return {
    name: 'dataset-learning-browser-adapters',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !(source in adapters)) return null;
      const importerFile = importer.split('?')[0];
      if (path.dirname(importerFile) !== engineDir) return null;
      return adapters[source];
    },
  };
}

/**
 * The sample CSVs live at the repo root (`data/`) because the Node CLI also
 * uses them. The browser build needs them under `dist/data/` so GitHub Pages
 * can serve them; in dev we serve the same directory through middleware.
 */
function sampleDataPlugin() {
  return {
    name: 'sample-data',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = (req.url || '').split('?')[0];
        if (!urlPath.startsWith('/data/')) {
          next();
          return;
        }
        const rel = decodeURIComponent(urlPath.slice('/data/'.length));
        const file = path.resolve(DATA_DIR, rel);
        if (!file.startsWith(DATA_DIR + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
          next();
          return;
        }
        const type = file.endsWith('.csv') ? 'text/csv; charset=utf-8' : 'application/json; charset=utf-8';
        res.setHeader('Content-Type', type);
        fs.createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      const out = path.resolve(__dirname, 'dist/data');
      fs.mkdirSync(out, { recursive: true });
      fs.cpSync(DATA_DIR, out, { recursive: true });
    },
  };
}

export default defineConfig({
  // Relative asset URLs work at any GitHub Pages path (user or project site).
  base: './',
  plugins: [react(), datasetLearningBrowserAdapters(), sampleDataPlugin()],
  server: {
    port: 5173,
    // The engine lives one level above the Vite root.
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
});
