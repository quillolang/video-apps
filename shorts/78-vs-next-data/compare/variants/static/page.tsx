import Database from "better-sqlite3";

type Trail = {
  id: number; name: string; km: number;
};

const db = new Database("trails.db");

export default function Home() {
  const trails = db
    .prepare("select * from trails order by name")
    .all() as Trail[];

  return (
    <ul>
      {trails.map((t) => (
        <li key={t.id}>{t.name}: {t.km} km</li>
      ))}
    </ul>
  );
}
