  if ($[0] !== draft || $[1] !== filter || $[2] !== items) {
    let t7;
    if ($[10] !== filter) {
      t7 = (i) => i.name.toLowerCase().includes(filter.toLowerCase());
      $[10] = filter;
      $[11] = t7;
    } else t7 = $[11];
    const shown = items.filter(t7);
    const open = items.filter(_temp);
    const total = open.reduce(_temp2, 0);
