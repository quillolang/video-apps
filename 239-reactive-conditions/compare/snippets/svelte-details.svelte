let label = $derived(open ? 'Hide details' : 'Show details')
<!-- ... -->
<section class="box box-details">
  <h2>Details</h2>
  <button onclick={() => (open = !open)}>{label}</button>
  {#if open}
    <p class="out">Ships in 2 days.</p>
  {/if}
</section>
