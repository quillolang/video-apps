// Trail Guide: the trails, a link to each.
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import trails from "../trails.json" with { type: "json" };

export default define.page(function Home() {
  return (
    <main>
      <Head><title>Trail Guide</title></Head>
      <h1>Trail Guide</h1>
      <ul>{trails.map((t) => <li><a href={`/trails/${t.id}`}>{t.name}</a></li>)}</ul>
    </main>
  );
});
