<!-- Six kinds of state on one page, each with a +1. -->
<script>
  let tab = $state(0)

  const address = Number(new URLSearchParams(location.search).get('n') ?? 0)

  // The counts the server keeps: /api/<id> reads one, a POST adds one.
  let counts = $state({ visitor: 0, everyone: 0, saved: 0, synced: 0 })
  for (const id of Object.keys(counts)) {
    fetch(`/api/${id}`).then((r) => r.json()).then((n) => (counts[id] = n))
  }
  async function add(id) {
    counts[id] = await fetch(`/api/${id}`, { method: 'POST' }).then((r) => r.json())
  }

  // Kept in sync: the server sends every new synced count over a WebSocket.
  $effect(() => {
    const scheme = location.protocol === 'https:' ? 'wss' : 'ws'
    const socket = new WebSocket(`${scheme}://${location.host}/api/synced/socket`)
    socket.onmessage = (e) => (counts.synced = Number(e.data))
    return () => socket.close()
  })
</script>

<h1>Where state lives</h1>
<button id="tab" onclick={() => tab++}>This tab: {tab}</button>
<a id="address" href="?n={address + 1}">The address: {address}</a>
<button id="visitor" onclick={() => add('visitor')}>This visitor: {counts.visitor}</button>
<button id="everyone" onclick={() => add('everyone')}>Everyone, until a restart: {counts.everyone}</button>
<button id="saved" onclick={() => add('saved')}>Everyone, for good: {counts.saved}</button>
<button id="synced" onclick={() => add('synced')}>Kept in sync: {counts.synced}</button>
