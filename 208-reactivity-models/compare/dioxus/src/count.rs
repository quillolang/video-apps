// The one line of measuring in each app: ran("Row") counts a component's code running (measure.mjs reads it).
use wasm_bindgen::prelude::*;

#[wasm_bindgen(inline_js = "export function ran(name) { const runs = (globalThis.__ran ??= {}); runs[name] = (runs[name] ?? 0) + 1; }")]
extern "C" {
    pub fn ran(name: &str);
}
