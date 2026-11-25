// The state the server keeps: SQLite for what lasts, and a variable that lasts until a restart.
import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync(process.env.STATE_DB ?? 'state.db', { timeout: 5000 })
db.exec('create table if not exists counts (name text primary key, n int not null)')
db.exec("insert or ignore into counts (name, n) values ('saved', 0), ('synced', 0)")

export const read = (name) => db.prepare('select n from counts where name = ?').get(name).n
export const add = (name) => db.prepare('update counts set n = n + 1 where name = ?').run(name)

let everyone = 0 // one value for this process, until it restarts
export const getEveryone = () => everyone
export const addEveryone = () => everyone++
