const label = open ? 'Hide details' : 'Show details'
// ...
<section className="box box-details">
  <h2>Details</h2>
  <button onClick={() => setOpen(!open)}>{label}</button>
  {open && <p className="out">Ships in 2 days.</p>}
</section>
