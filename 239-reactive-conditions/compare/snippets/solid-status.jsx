<Switch fallback={<span>3 messages</span>}>
  <Match when={status() === 'loading'}><em>Loading…</em></Match>
  <Match when={status() === 'error'}><strong>Couldn't load</strong></Match>
</Switch>
