// The site's own error page: what wasn't found, and a link back.
import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function ErrorPage({ error }) {
  const status = error instanceof HttpError ? error.status : 500;
  const what = status !== 404 ? "Something went wrong"
    : error instanceof HttpError && error.message ? error.message : "No such page";
  return (
    <main>
      <Head><title>{what}</title></Head>
      <a href="/">← All trails</a>
      <h1 class="missing">{status === 404 ? `404: ${what}` : what}</h1>
    </main>
  );
});
