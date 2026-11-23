<script>
  import { ITEMS } from './items.js'
  import { ran } from './count.js'
  import Row from './Row.svelte'
  import './groceries.css'

  ran('App')
  let items = $state(ITEMS.map((i) => ({ ...i })))
  let filter = $state('')
  let draft = $state('')

  let shown = $derived(items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase())))
  let open = $derived(items.filter((i) => !i.done))
  let total = $derived(open.reduce((sum, i) => sum + i.cents * i.qty, 0))
  const money = (cents) => `$${(cents / 100).toFixed(2)}`

  function toggle(id) {
    const item = items.find((i) => i.id === id)
    item.done = !item.done
  }
  function remove(id) {
    items = items.filter((i) => i.id !== id)
  }
  function add(e) {
    e.preventDefault()
    if (!draft.trim()) return
    const id = Math.max(0, ...items.map((i) => i.id)) + 1
    items.push({ id, name: draft.trim(), cents: 100, qty: 1, done: false })
    draft = ''
  }
</script>

<main class="groceries">
  <h1>Groceries</h1>
  <form class="add" onsubmit={add}>
    <input bind:value={draft} placeholder="Add an item" aria-label="New item" />
    <button>Add</button>
  </form>
  <input class="filter" bind:value={filter} placeholder="Filter" aria-label="Filter" />
  <p class="summary">{open.length} left · {money(total)}</p>
  <ul class="list">
    {#each shown as item (item.id)}
      <Row {item} {toggle} {remove} />
    {/each}
  </ul>
</main>
