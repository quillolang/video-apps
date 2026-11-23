// The one line of measuring in each app: ran("Row") counts a component's code running (measure.mjs reads it).
export function ran(name) {
  const runs = (globalThis.__ran ??= {});
  runs[name] = (runs[name] ?? 0) + 1;
}
