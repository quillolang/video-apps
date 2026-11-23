  let items = $state(ITEMS.map((i) => ({ ...i })))
  let filter = $state('')
  let draft = $state('')

  let shown = $derived(items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase())))
  let open = $derived(items.filter((i) => !i.done))
  let total = $derived(open.reduce((sum, i) => sum + i.cents * i.qty, 0))
