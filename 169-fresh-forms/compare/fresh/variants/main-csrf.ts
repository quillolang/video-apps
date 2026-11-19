import { App, csrf, staticFiles } from "fresh";
import { type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());
// Form posts only from this site's own pages: a cross-site one gets a 403.
app.use(csrf());

// Include file-system based routes here
app.fsRoutes();
