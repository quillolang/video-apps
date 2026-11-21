// Trail notes: the page reads notes.json, which isn't there yet, so the page fails.
import { readFileSync } from 'node:fs'

export default function Home() {
  const notes = JSON.parse(readFileSync('notes.json', 'utf8'))
  return (
    <main>
      <h1>🥾 Trail notes</h1>
      <p>{notes.length} notes</p>
    </main>
  )
}
