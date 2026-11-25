<script>
  let unread = $state(0)
  let running = $state(false)
  let speed = $state(100)
  let ticks = $state(0)
  let todos = $state([
    { id: 1, text: 'Milk', done: true },
    { id: 2, text: 'Bread', done: false },
    { id: 3, text: 'Eggs', done: false },
  ])
  let showDone = $state(false)
  let joining = $state(false)

  $effect(() => {
    if (!running) return
    const id = setInterval(() => ticks++, speed)
    return () => clearInterval(id)
  })
</script>

<main>
  <h1>Svelte</h1>
  <section class="box box-if">
    <h2>Unread</h2>
    <button onclick={() => unread++}>+1 unread</button>
    <button onclick={() => (unread = 0)}>Read all</button>
    <p class="out">
      {#if unread === 0}
        <span>All read</span>
      {:else if unread === 1}
        <span>1 new message</span>
      {:else}
        <strong>{unread} new messages</strong>
      {/if}
    </p>
  </section>
  <section class="box box-timer">
    <h2>Ticker</h2>
    <button onclick={() => (running = !running)}>{running ? 'Stop' : 'Start'}</button>
    <button onclick={() => (speed = speed / 2)}>Faster</button>
    <p class="out">{ticks} ticks</p>
    {#if running}
      <input placeholder="A note, while it runs" aria-label="Note" />
    {/if}
  </section>
  <section class="box box-list">
    <h2>Shopping</h2>
    <label><input type="checkbox" bind:checked={showDone} /> Show done</label>
    <ul>
      {#each todos as t (t.id)}
        {#if showDone || !t.done}
          <li>{t.text}</li>
        {/if}
      {/each}
    </ul>
  </section>
  <section class="box box-one">
    <h2>Log in or sign up</h2>
    <button onclick={() => (joining = !joining)}>{joining ? 'I have an account' : "I'm new here"}</button>
    <input placeholder={joining ? 'Work email' : 'Your email'} aria-label="Email" />
  </section>
</main>
