// Use the phone app the way a person does: its own React Native code, built for the web, in a browser the size of an
// iPhone 17 Pro Max. Step by step for an agent, or a saved journey all at once. How to use it: e2e/README.md, "Using the app".
import { execSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HELP, controls, launch, run } from './phone/steps.mjs';

const self = fileURLToPath(import.meta.url);
const repo = path.resolve(path.dirname(self), '..');
const OUT = path.join(repo, 'e2e/look');
const JOURNEYS = path.join(repo, 'e2e/journeys');
const DIST = path.join(repo, 'mobile/dist-phone');
const STATE = path.join(OUT, '.session.json');
const PIDS = path.join(OUT, '.pids.json');
// Ports of their own for each checkout, so agents in other worktrees (and the UI tests on 8082) never meet this one.
const slot = parseInt(createHash('sha1').update(repo).digest('hex').slice(0, 4), 16) % 500;
const PORT = 20_000 + slot * 2; // the app
const DRIVER = PORT + 1; // the open browser, which takes steps
const BASE = `http://127.0.0.1:${PORT}`;

const [command, ...rest] = process.argv.slice(2);
const reuse = rest.includes('--reuse');
const words = rest.filter(arg => arg !== '--reuse');

const up = async url => { try { return (await fetch(url)).status < 500; } catch { return false; } };
const until = async (check, ms) => { for (let t = 0; t < ms && !(await check()); t += 100) await new Promise(done => setTimeout(done, 100)); };
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const pids = () => { try { return JSON.parse(fs.readFileSync(PIDS, 'utf8')); } catch { return {}; } };
const writeAtOnce = (file, text) => { fs.writeFileSync(`${file}.tmp`, text); fs.renameSync(`${file}.tmp`, file); };

/** Builds the app for the web (unless --reuse finds a build) and serves it on PORT. */
async function serve() {
  if (await up(BASE)) throw new Error(`Port ${PORT} is already serving. Run "npm run phone -- stop".`);
  if (!reuse || !fs.existsSync(path.join(DIST, 'index.html'))) {
    console.log('Building the app for the web (about a minute)...');
    execSync(`npx expo export --platform web --output-dir ${path.basename(DIST)}`, { cwd: path.join(repo, 'mobile'), stdio: ['ignore', 'ignore', 'inherit'] });
  }
  const server = spawn('node', [path.join(repo, 'e2e/serve.mjs'), DIST, String(PORT)], { stdio: 'ignore' });
  process.on('exit', () => server.kill());
  await until(() => up(BASE), 5000);
  return server;
}

/** Saves the screen under `dir` and returns its path from the repo root. */
async function shot(page, dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, animations: 'disabled' });
  return path.relative(repo, file);
}

/** One step, then what a person would see: the screenshot, what can be tapped, and any error the page raised. */
async function stepAndLook(page, errors, step, dir, name) {
  const before = errors.length;
  const seen = { stuck: null, shot: null, controls: [], errors: [] };
  try {
    await run(page, step);
  } catch (error) { seen.stuck = error.message.split('\n')[0]; }
  try {
    seen.shot = await shot(page, dir, name);
    seen.controls = await controls(page);
  } catch (error) { seen.stuck ??= `The screen could not be read: ${error.message.split('\n')[0]}`; }
  seen.errors = errors.slice(before);
  return seen;
}

const report = ({ stuck, shot: file, controls: list, errors }) => {
  if (stuck) console.log(`STUCK: ${stuck}`);
  if (file) console.log(`screenshot: ${file}`);
  console.log(`on screen:\n${list.map(item => `  ${item}`).join('\n') || '  nothing to tap'}`);
  if (errors.length) console.log(`ERRORS:\n${errors.map(error => `  ${error}`).join('\n')}`);
};

/** Closes the open phone, even when its browser no longer answers. */
async function stop() {
  const { driver, server } = pids();
  await fetch(`http://127.0.0.1:${DRIVER}`, { method: 'POST', body: '["stop"]' }).catch(() => {});
  for (const pid of [driver, server]) if (pid && alive(pid)) process.kill(pid);
  fs.rmSync(PIDS, { force: true });
}

const usage = () => console.log(`npm run phone -- start [--reuse]     build the app, open the phone, show the home screen
npm run phone -- <step>              one step, then a screenshot and what can be tapped:
  ${Object.values(HELP).join('\n  ')}
npm run phone -- save <name>         save the steps since start as e2e/journeys/<name>.json
npm run phone -- stop                close the phone
npm run phone -- run <name>... [--reuse]   walk saved journeys from the start; fails if a step is stuck or the page errs
Journeys: ${fs.readdirSync(JOURNEYS).filter(file => file.endsWith('.json')).map(file => file.slice(0, -5)).join(', ')}`);

if (command === 'driver') {
  // Kept running by `start`: holds the browser between steps and records them for `save`.
  process.on('uncaughtException', error => { console.error(error); process.exit(1); });
  process.on('unhandledRejection', error => { console.error(error); process.exit(1); });
  const server = await serve();
  writeAtOnce(PIDS, JSON.stringify({ driver: process.pid, server: server.pid }));
  const { browser, page, errors } = await launch(BASE);
  const steps = [];
  let count = 0;
  const take = async step => {
    const seen = await stepAndLook(page, errors, step, OUT, `${String(count++).padStart(2, '0')}-${step[0]}`);
    // A step that got stuck or raised an error is not kept, so a saved walk replays cleanly.
    if (!seen.stuck && !seen.errors.length && step[0] !== 'look') steps.push(step);
    return seen;
  };
  http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      if (req.method !== 'POST') return res.end('{}');
      let step;
      try { step = JSON.parse(body); } catch { return res.end('{}'); }
      if (step[0] === 'steps') return res.end(JSON.stringify(steps));
      if (step[0] === 'stop') { res.end('{}'); await browser.close().catch(() => {}); process.exit(0); }
      res.end(JSON.stringify(await take(step)));
    });
  }).listen(DRIVER, '127.0.0.1', async () => writeAtOnce(STATE, JSON.stringify(await take(['open', '/']))));
} else if (command === 'start') {
  const { driver } = pids();
  if ((driver && alive(driver)) || (await up(`http://127.0.0.1:${DRIVER}`))) throw new Error('The phone is already open. Run "npm run phone -- stop" first.');
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const log = fs.openSync(path.join(OUT, 'driver.log'), 'w');
  const child = spawn('node', [self, 'driver', ...(reuse ? ['--reuse'] : [])], { detached: true, stdio: ['ignore', log, log] });
  writeAtOnce(PIDS, JSON.stringify({ driver: child.pid }));
  let ended = false;
  child.on('exit', () => (ended = true));
  child.unref();
  await until(() => ended || fs.existsSync(STATE), 600_000);
  if (!fs.existsSync(STATE)) {
    await stop();
    throw new Error(`The phone did not open. From e2e/look/driver.log:\n${fs.readFileSync(path.join(OUT, 'driver.log'), 'utf8').slice(-1500)}`);
  }
  report(JSON.parse(fs.readFileSync(STATE, 'utf8')));
} else if (command === 'stop') {
  await stop();
  console.log('Closed.');
} else if (command === 'run') {
  if (!words.length) { usage(); process.exit(1); }
  await serve();
  const { browser, page, errors } = await launch(BASE);
  const dir = path.join(OUT, 'run');
  let failed = false;
  for (const name of words) {
    const file = path.join(JOURNEYS, `${name}.json`);
    if (!fs.existsSync(file)) { console.log(`No journey "${name}".`); failed = true; continue; }
    const { steps } = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`\n${name}`);
    for (const [i, step] of steps.entries()) {
      const seen = await stepAndLook(page, errors, step, dir, `${name}-${String(i + 1).padStart(2, '0')}`);
      const problems = [seen.stuck, ...seen.errors].filter(Boolean);
      console.log(`  ${problems.length ? 'FAIL' : 'ok  '} ${step.join(' ')}  ${seen.shot ?? ''}`);
      for (const problem of problems) console.log(`       ${problem}`);
      if (problems.length) { failed = true; break; }
    }
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
} else if (command in HELP || command === 'save') {
  if (!(await up(`http://127.0.0.1:${DRIVER}`))) throw new Error('The phone is not open. Run "npm run phone -- start" first.');
  const ask = step => fetch(`http://127.0.0.1:${DRIVER}`, { method: 'POST', body: JSON.stringify(step) }).then(res => res.json());
  if (command === 'save') {
    if (!words[0]) throw new Error('save takes a name, e.g. save reader-menu');
    const file = path.join(JOURNEYS, `${words[0]}.json`);
    const steps = await ask(['steps']);
    fs.writeFileSync(file, `{"steps": [\n${steps.map(step => `  ${JSON.stringify(step)}`).join(',\n')}\n]}\n`);
    console.log(`Saved ${path.relative(repo, file)}. Rerun it with: npm run phone -- run ${words[0]}`);
  } else report(await ask(words.length ? [command, words.join(' ')] : [command]));
} else {
  usage();
  process.exit(command ? 1 : 0);
}
