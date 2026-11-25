<script>
  import Counter from './Counter.svelte'

  let open = $state(false)
  let status = $state('loading')
  let unread = $state(0)
  let joining = $state(false)
  let shown = $state(true)
  let label = $derived(open ? 'Hide details' : 'Show details')
</script>

<main>
  <h1>Svelte</h1>
  <section class="box box-details">
    <h2>Details</h2>
    <button onclick={() => (open = !open)}>{label}</button>
    {#if open}
      <p class="out">Ships in 2 days.</p>
    {/if}
  </section>
  <section class="box box-status">
    <h2>Status</h2>
    <button onclick={() => (status = 'loading')}>Loading</button>
    <button onclick={() => (status = 'error')}>Error</button>
    <button onclick={() => (status = 'ready')}>Ready</button>
    <p class="out">
      {#if status === 'loading'}
        <em>Loading…</em>
      {:else if status === 'error'}
        <strong>Couldn't load</strong>
      {:else}
        <span>3 messages</span>
      {/if}
    </p>
  </section>
  <section class="box box-zero">
    <h2>Unread</h2>
    <button onclick={() => unread++}>+1 unread</button>
    <button onclick={() => (unread = 0)}>Read all</button>
    <p class="out">Inbox{#if unread > 0}<span class="badge">{unread} new</span>{/if}</p>
  </section>
  <section class="box box-switch wide">
    <h2>Log in or sign up</h2>
    <button onclick={() => (joining = !joining)}>{joining ? 'I have an account' : "I'm new here"}</button>
    {#if joining}
      <input placeholder="Work email" aria-label="Work email" />
    {:else}
      <input placeholder="Your email" aria-label="Your email" />
    {/if}
  </section>
  <section class="box box-keep">
    <h2>Counter</h2>
    <button onclick={() => (shown = !shown)}>{shown ? 'Hide counter' : 'Show counter'}</button>
    {#if shown}
      <Counter />
    {/if}
  </section>
</main>
