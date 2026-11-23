  const [items, setItems] = useState(ITEMS);
  const [filter, setFilter] = useState('');
  const [draft, setDraft] = useState('');

  const shown = items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));
  const open = items.filter((i) => !i.done);
  const total = open.reduce((sum, i) => sum + i.cents * i.qty, 0);
