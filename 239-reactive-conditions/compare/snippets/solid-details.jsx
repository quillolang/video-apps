const label = () => (open() ? 'Hide details' : 'Show details');
// ...
<section class="box box-details">
  <h2>Details</h2>
  <button onClick={() => setOpen(!open())}>{label()}</button>
  <Show when={open()}>
    <p class="out">Ships in 2 days.</p>
  </Show>
</section>
