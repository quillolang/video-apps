<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])
const problem = ref(null)

onMounted(async () => {
  const res = await fetch('/api/orders')
  if (res.ok) orders.value = await res.json()
  else problem.value = `Couldn't load the orders (${res.status})`
})
</script>

<template>
  <h1>Today's orders</h1>
  <p v-if="problem" class="error">{{ problem }}</p>
  <table v-else>
    <tr><th>#</th><th>Name</th><th>Pie</th><th>Pickup</th></tr>
    <tr v-for="o in orders" :key="o.id">
      <td>{{ o.id }}</td><td>{{ o.name }}</td><td>{{ o.count }} × {{ o.pie }}</td><td>{{ o.pickup }}</td>
    </tr>
  </table>
</template>
