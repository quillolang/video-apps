<ul>
  {todos
    .filter((t) => showDone || !t.done)
    .map((t) => <li key={t.id}>{t.text}</li>)}
</ul>
