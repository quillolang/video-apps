// Trail Club's sign-up for Saturday's hike: a name and how many are coming. A form that's wrong comes back, with
// what's wrong by its field and what was typed still in it; one that's right is added, and back to the list.
import { page } from "fresh";
import { DatabaseSync } from "node:sqlite";
import { define } from "../utils.ts";

const db = new DatabaseSync("club.db");
db.exec(`create table if not exists hikers (
  id integer primary key,
  name text not null,
  guests integer not null
)`);
type Hiker = { id: number; name: string; guests: number };
type Data = { hikers: Hiker[]; form: Record<string, string>; bad: Record<string, string> };
const hikers = () => db.prepare("select * from hikers order by id").all() as Hiker[];

export const handler = define.handlers({
  GET() {
    return page<Data>({ hikers: hikers(), form: {}, bad: {} });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    // Text only (a field can hold a file), and guests only as digits.
    const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");
    const name = text(form.get("name"));
    const guests = text(form.get("guests"));
    const n = /^[0-9]+$/.test(guests.trim()) ? Number(guests) : NaN;
    const bad: Record<string, string> = {};
    if (name.trim() === "") bad.name = "Your name, please";
    if (!Number.isInteger(n) || n < 1 || n > 12) bad.guests = "From 1 to 12";
    if (Object.keys(bad).length > 0) {
      return page<Data>({ hikers: hikers(), form: { name, guests }, bad }, { status: 400 });
    }
    db.prepare("insert into hikers (name, guests) values (?, ?)").run(name.trim(), n);
    return ctx.redirect("/", 303);
  },
});

export default define.page<typeof handler>(({ data }) => (
  <>
    <h1>Saturday's hike</h1>
    <ul>{data.hikers.map((h) => <li key={h.id}>{h.name}: {h.guests}</li>)}</ul>
    <form method="post">
      <p>
        <label>Name <input name="name" value={data.form.name ?? ""} /></label>
        {data.bad.name && <strong> {data.bad.name}</strong>}
      </p>
      <p>
        <label>Guests <input name="guests" value={data.form.guests ?? ""} /></label>
        {data.bad.guests && <strong> {data.bad.guests}</strong>}
      </p>
      <button type="submit">Sign up</button>
    </form>
  </>
));
