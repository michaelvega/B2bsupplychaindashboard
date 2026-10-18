/**
 * Builds the Foundry demo (foundry/web) and copies it to dist/foundry so the
 * gated Pages Function in functions/foundry/ can serve it. Runs after the main
 * Vite build, which empties dist/.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = path.join(root, 'foundry', 'web');
const out = path.join(root, 'dist', 'foundry');

const run = (cmd) => execSync(cmd, { cwd: web, stdio: 'inherit' });

run(existsSync(path.join(web, 'package-lock.json')) ? 'npm ci --no-audit --no-fund' : 'npm install --no-audit --no-fund');
run('npm run build');

rmSync(out, { recursive: true, force: true });
cpSync(path.join(web, 'dist'), out, { recursive: true });
console.log(`Foundry demo copied to ${path.relative(root, out)}`);
