// The state the server keeps: SQLite for what lasts, a variable until a restart, and the pages listening for sync.
import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync(process.env.STATE_DB ?? 'state.db', { timeout: 5000 })
db.exec('create table if not exists counts (name text primary key, n int not null)')
db.exec("insert or ignore into counts (name, n) values ('saved', 0), ('synced', 0)")

export const read = (name: string): number => Number(db.prepare('select n from counts where name = ?').get(name)!.n)
export const add = (name: string) => {
  db.prepare('update counts set n = n + 1 where name = ?').run(name)
  return read(name)
}

export const counter = { everyone: 0 } // one value for this process, until it restarts
type Send = (n: number) => void
export const listeners = new Set<Send>() // this process's open pages, waiting for sync

// The visitor's session: sealed in a cookie with SESSION_SECRET (at least 32 characters).
export const visitorSession = (event: any) => useSession(event, { password: process.env.SESSION_SECRET! })
