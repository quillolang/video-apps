// The one line of measuring, for Quillo's js("ran", ["Row"]): counts a component's code running (measure.mjs reads it).
function ran(name) {
  const runs = (globalThis.__ran ??= {});
  runs[name] = (runs[name] ?? 0) + 1;
}
