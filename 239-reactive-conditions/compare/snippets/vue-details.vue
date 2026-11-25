const label = computed(() => (open.value ? 'Hide details' : 'Show details'))
<!-- ... -->
<section class="box box-details">
  <h2>Details</h2>
  <button @click="open = !open">{{ label }}</button>
  <p v-if="open" class="out">Ships in 2 days.</p>
</section>
