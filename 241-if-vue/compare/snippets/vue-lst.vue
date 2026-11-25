const shown = computed(() => todos.value.filter((t) => showDone.value || !t.done))
<!-- ... -->
<li v-for="t in shown" :key="t.id">{{ t.text }}</li>
