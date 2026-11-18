// A trail's page, at /trails/<its number>: the file's name, [id], is its parameter; its pattern is below.
import { HttpError, page, type RouteConfig } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import trails from "../../trails.json" with { type: "json" };

// Only a whole number, with no leading zero: anything else isn't this route at all.
export const config: RouteConfig = { routeOverride: "/trails/:id([1-9][0-9]*)" };

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
