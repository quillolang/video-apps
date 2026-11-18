// A trail's page, at /trails/<its number>: the file's name, [id], is the route's parameter.
import { HttpError, page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import trails from "../../trails.json" with { type: "json" };

export const handler = define.handlers({
  GET(ctx) {
    const trail = trails.find((t) => t.id === Number(ctx.params.id));
    if (!trail) throw new HttpError(404, "No such trail");
    return page({ trail });
  },
});

export default define.page<typeof handler>(({ data: { trail } }) => (
  <main>
    <Head><title>{trail.name}</title></Head>
    <a href="/">← All trails</a>
    <h1>{trail.name}</h1>
    <p class="facts">{trail.km} km · {trail.climb} m climb · {trail.level}</p>
  </main>
));
