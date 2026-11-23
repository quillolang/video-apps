<script setup>
import { onBeforeUpdate } from 'vue'
import { ran } from '../count.js'

defineProps({ item: Object })
defineEmits(['toggle', 'remove'])
const money = (cents) => `$${(cents / 100).toFixed(2)}`

ran('Row')
onBeforeUpdate(() => ran('Row'))
</script>

<template>
  <li :class="{ done: item.done }">
    <label>
      <input type="checkbox" :checked="item.done" @change="$emit('toggle', item.id)" />
      <span class="name">{{ item.name }}</span>
    </label>
    <span class="qty">×{{ item.qty }}</span>
    <span class="price">{{ money(item.cents) }}</span>
    <button class="remove" :aria-label="`Remove ${item.name}`" @click="$emit('remove', item.id)">×</button>
  </li>
</template>
