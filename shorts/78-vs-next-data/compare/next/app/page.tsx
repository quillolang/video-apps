import Database from "better-sqlite3";
import { connection } from "next/server";
import { Suspense } from "react";

type Trail = {
  id: number; name: string; km: number;
};

const db = new Database("trails.db");

async function Trails() {
  await connection();
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

export default function Home() {
  return (
    <Suspense>
      <Trails />
    </Suspense>
  );
}
