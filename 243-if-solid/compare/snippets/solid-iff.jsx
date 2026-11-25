<Switch fallback={<strong>{unread()} new messages</strong>}>
  <Match when={unread() === 0}><span>All read</span></Match>
  <Match when={unread() === 1}><span>1 new message</span></Match>
</Switch>
