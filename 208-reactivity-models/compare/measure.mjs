// What each Groceries app does for one change, measured in Chromium from outside the app:
//   draft  a letter typed in the "Add an item" box (state nothing else on the page shows)
//   filter a letter typed in the filter box ("a": 29 of the 50 rows stay)
//   tick   Bananas ticked
//   add    Basil added (the Add button clicked, the name already typed)
// For each: the component code that ran (each app's ran("Row") / ran("App") line, counted in globalThis.__ran),
// the DOM writes (a MutationObserver: each node added or removed, each attribute and each text written), the net
// changes (nodes added or removed, and the attributes and texts whose value at the end differs from the value before
// the change: a write of the same value, or a remove and put back, is no change), and the
// time from the key or click to the last DOM change (performance.now in a capture listener, and in the observer).
// Each change is made once to warm up, then ROUNDS times (each undone between, not measured); counts are the
// median round's, the time is the median of the rounds.
//   node measure.mjs react=http://127.0.0.1:5181 ... quillo=http://127.0.0.1:8096 > runs/measure.txt
// JSON_FILE=runs/measure.json writes everything as JSON too.
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROUNDS = Number(process.env.ROUNDS || 21);
const targets = process.argv.slice(2).map((a) => a.split('='));
const observer = `
  // React's renders, read from React's own commits as React DevTools reads them (videos/115's counters.js): a
  // component fiber with the PerformedWork flag, in a part of the tree the commit made again.
  globalThis.__fibers = {};
  {
    const COMPONENT = new Set([0, 1, 11, 15]), PERFORMED_WORK = 1;
    const nameOf = (f) => (f.type && (f.type.displayName || f.type.name)) || 'Anonymous';
    const walk = (next, prev) => {
      if (COMPONENT.has(next.tag) && (prev === null || (next.flags & PERFORMED_WORK))) {
        const n = nameOf(next); globalThis.__fibers[n] = (globalThis.__fibers[n] || 0) + 1;
      }
      if (prev !== null && next.child === prev.child) return;
      for (let c = next.child; c; c = c.sibling) walk(c, c.alternate);
    };
    let id = 0;
    globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, isDisabled: false, renderers: new Map(),
      inject(r) { id += 1; this.renderers.set(id, r); return id; },
      onCommitFiberRoot(_id, root) { walk(root.current, root.current.alternate); },
      onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {} };
  }
  globalThis.__dom = { nodes: 0, attrs: 0, texts: 0, before: new Map(), last: 0, at: 0 };
  const start = (e) => { if (e.isTrusted) globalThis.__dom.at = performance.now(); };
  addEventListener('keydown', start, true);
  addEventListener('pointerdown', start, true);
  new MutationObserver((records) => {
    const d = globalThis.__dom;
    for (const r of records) {
      if (r.type === 'childList') d.nodes += r.addedNodes.length + r.removedNodes.length;
      else {
        if (r.type === 'attributes') d.attrs += 1; else d.texts += 1;
        const was = d.before.get(r.target) || new Map();
        const key = r.type === 'attributes' ? r.attributeName : '#text';
        if (!was.has(key)) was.set(key, r.oldValue);
        d.before.set(r.target, was);
      }
    }
    d.last = performance.now();
  }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true, attributeOldValue: true, characterDataOldValue: true });
`;
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const browser = await chromium.launch();
const results = {};
for (const [name, url] of targets) {
  const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
  await page.addInitScript(observer);
  await page.goto(url);
  await page.waitForFunction(() => document.querySelectorAll('.list li').length === 50, null, { timeout: 30000 });
  await page.waitForTimeout(500);
  const reset = () => page.evaluate(() => {
    globalThis.__ran = {}; globalThis.__fibers = {};
    Object.assign(globalThis.__dom, { nodes: 0, attrs: 0, texts: 0, before: new Map(), last: 0, at: 0 });
  });
  const settle = () => page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(ok, 50)))));
  const read = () => page.evaluate(() => {
    const d = globalThis.__dom, ran = { ...globalThis.__ran }, fibers = { ...globalThis.__fibers };
    let net = d.nodes;
    for (const [el, was] of d.before) for (const [key, old] of was) {
      if ((key === '#text' ? el.textContent : el.getAttribute(key)) !== old) net += 1;
    }
    return { ran, fibers, runs: Object.values(ran).reduce((a, b) => a + b, 0), dom: d.nodes + d.attrs + d.texts,
      net, nodes: d.nodes, attrs: d.attrs, texts: d.texts, ms: d.last && d.at ? d.last - d.at : 0 };
  });
  const tick = page.getByRole('checkbox').nth(1);
  const changes = {
    draft: { focus: '.add input', make: () => page.keyboard.press('b'), undo: () => page.keyboard.press('Backspace') },
    filter: { focus: '.filter', make: () => page.keyboard.press('a'), undo: () => page.keyboard.press('Backspace') },
    tick: { make: () => tick.click(), undo: () => tick.click() },
    add: {
      before: async () => { await page.fill('.add input', 'Basil'); await settle(); },
      make: () => page.getByRole('button', { name: 'Add' }).click(),
      undo: () => page.getByRole('button', { name: 'Remove Basil' }).click(),
    },
  };
  results[name] = {};
  for (const [change, c] of Object.entries(changes)) {
    if (c.focus) { await page.click(c.focus); await settle(); }
    const rounds = [];
    for (let i = 0; i <= ROUNDS; i++) {
      if (c.before) await c.before();
      await reset();
      await c.make();
      await settle();
      await page.waitForTimeout(30);
      const r = await read();
      if (i > 0) rounds.push(r);           // round 0 warms up (and resumes Quillo's component the first time)
      await c.undo();
      await settle();
    }
    const ms = median(rounds.map((r) => r.ms));
    const mid = rounds.find((r) => r.runs === median(rounds.map((x) => x.runs)) && r.dom === median(rounds.map((x) => x.dom)) && r.net === median(rounds.map((x) => x.net))) || rounds[0];
    results[name][change] = { ...mid, ms: Math.round(ms * 100) / 100, msAll: rounds.map((r) => Math.round(r.ms * 100) / 100),
      runsAll: rounds.map((r) => r.runs), domAll: rounds.map((r) => r.dom), netAll: rounds.map((r) => r.net) };
  }
  await page.close();
}
await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(`Chromium ${browser.version()}, ${ROUNDS} rounds of each change; counts from the median round, time the median`);
for (const change of ['draft', 'filter', 'tick', 'add']) {
  console.log(`\n${change}`);
  console.log(`  ${pad('app', 8)}${pad('code runs', 26)}${pad('DOM writes', 46)}ms to last change`);
  for (const [name, r] of Object.entries(results)) {
    const x = r[change];
    const ran = Object.entries(x.ran).map(([k, v]) => `${k} ${v}`).join(', ') || 'none';
    console.log(`  ${pad(name, 8)}${pad(ran, 26)}${pad(`${x.dom} (${x.nodes} nodes, ${x.attrs} attrs, ${x.texts} texts) net ${x.net}`, 46)}${x.ms}`);
  }
}
if (process.env.JSON_FILE) fs.writeFileSync(process.env.JSON_FILE, JSON.stringify({ chromium: browser.version(), rounds: ROUNDS, results }, null, 2));
