// A slow search, as a server would answer: how many items have q in their name. One letter takes 900 ms, more take
// 150 ms, so "a" then "ap" typed quickly answers "ap" first and "a" last.
import { ITEMS } from './items.js';
export function search(q) {
  const n = ITEMS.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())).length;
  return new Promise((ok) => setTimeout(() => ok(n), q.length === 1 ? 900 : 150));
}
