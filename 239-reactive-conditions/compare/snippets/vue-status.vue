<p class="out">
  <em v-if="status === 'loading'">Loading…</em>
  <strong v-else-if="status === 'error'">Couldn't load</strong>
  <span v-else>3 messages</span>
</p>
