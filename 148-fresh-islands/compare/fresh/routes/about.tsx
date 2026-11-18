import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

// A page with no island: nothing on it runs in the browser.
export default define.page(function About() {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>About Fresh</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">About</h1>
        <p class="my-4">A page with no island: just HTML and CSS.</p>
        <a href="/">Back to the counter</a>
      </div>
    </div>
  );
});
