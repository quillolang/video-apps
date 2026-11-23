const items = ref(ITEMS.map((i) => ({ ...i })))
const filter = ref('')
const draft = ref('')

const shown = computed(() => items.value.filter((i) => i.name.toLowerCase().includes(filter.value.toLowerCase())))
const open = computed(() => items.value.filter((i) => !i.done))
const total = computed(() => open.value.reduce((sum, i) => sum + i.cents * i.qty, 0))
