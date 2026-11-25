{#if status === 'loading'}
  <em>Loading…</em>
{:else if status === 'error'}
  <strong>Couldn't load</strong>
{:else}
  <span>3 messages</span>
{/if}
