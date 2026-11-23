  const [items, setItems] = createStore(ITEMS.map((i) => ({ ...i })));
  const [filter, setFilter] = createSignal('');
  const [draft, setDraft] = createSignal('');

  const shown = createMemo(() => items.filter((i) => i.name.toLowerCase().includes(filter().toLowerCase())));
  const open = createMemo(() => items.filter((i) => !i.done));
  const total = createMemo(() => open().reduce((sum, i) => sum + i.cents * i.qty, 0));
