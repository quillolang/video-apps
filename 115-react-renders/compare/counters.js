// Put into each page before its scripts (Playwright's addInitScript). It counts, from outside the app's code:
// - window.__renders: React components that rendered, by name, read from React's own commits the way React
//   DevTools reads them (a fiber with the PerformedWork flag, in a part of the tree that this commit made again).
//   Pages without React never call it, so it stays empty.
// - window.__mutations: the DOM changes (MutationObserver records) under <body>.
// - window.__lastUpdate: performance.now() of the last DOM change, and window.__inputAt: of the last keydown or
//   pointerdown.
// - With window.__highlight set (by a script put in before this one), it outlines what it counted, as React
//   DevTools' "Highlight updates" does: orange around each component that ran (its first element), green around
//   each element the DOM changes touched. The outlines sit outside <body>, so they are not counted;
//   window.__clearHighlight() takes them away. While window.__frozen is set, nothing is counted: a screenshot
//   changes the focused input's style (Playwright hides the caret), and that is not the app's doing.
(() => {
  const outline = (el, color) => {
    if (!window.__highlight || !el || !el.getBoundingClientRect) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || r.width === 0) return;
    const d = document.createElement('div');
    d.className = '__hl';
    Object.assign(d.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`,
      height: `${r.height}px`, outline: `3px solid ${color}`, outlineOffset: color === '#16a34a' ? '-1px' : '-4px',
      borderRadius: '4px', pointerEvents: 'none', zIndex: 2147483647 });
    document.documentElement.appendChild(d);
  };
  window.__clearHighlight = () => document.querySelectorAll('.__hl').forEach((d) => d.remove());
  const hostOf = (fiber) => { let f = fiber.child; while (f && f.tag !== 5) f = f.child; return f && f.stateNode; };
  const renders = (window.__renders = {});
  const COMPONENT = new Set([0, 1, 11, 15]); // function, class, forwardRef, simple memo
  const PERFORMED_WORK = 1;
  const nameOf = (f) => (f.type && (f.type.displayName || f.type.name)) || 'Anonymous';
  function walk(next, prev) {
    if (COMPONENT.has(next.tag) && (prev === null || (next.flags & PERFORMED_WORK))) {
      const n = nameOf(next);
      renders[n] = (renders[n] || 0) + 1;
      outline(hostOf(next), '#f97316');
    }
    if (prev !== null && next.child === prev.child) return; // this part of the tree was not made again
    for (let c = next.child; c; c = c.sibling) walk(c, c.alternate);
  }
  let id = 0;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    isDisabled: false,
    renderers: new Map(),
    inject(renderer) { id += 1; this.renderers.set(id, renderer); return id; },
    onCommitFiberRoot(_id, root) { walk(root.current, root.current.alternate); },
    onCommitFiberUnmount() {},
    onPostCommitFiberRoot() {},
    checkDCE() {},
  };

  window.__mutations = 0;
  window.__lastUpdate = 0;
  window.__inputAt = 0;
  for (const e of ['keydown', 'pointerdown']) addEventListener(e, () => { window.__inputAt = performance.now(); }, true);
  addEventListener('DOMContentLoaded', () => {
    new MutationObserver((records) => {
      if (window.__frozen) return;
      window.__mutations += records.length;
      for (const m of records) outline(m.type === 'characterData' ? m.target.parentElement : m.target, '#16a34a');
      window.__lastUpdate = performance.now();
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });
  });
})();
