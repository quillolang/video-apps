<script>
  import { ran } from './count.js'

  let { item, toggle, remove } = $props()
  const money = (cents) => `$${(cents / 100).toFixed(2)}`

  ran('Row')
</script>

<li class={{ done: item.done }}>
  <label>
    <input type="checkbox" checked={item.done} onchange={() => toggle(item.id)} />
    <span class="name">{item.name}</span>
  </label>
  <span class="qty">×{item.qty}</span>
  <span class="price">{money(item.cents)}</span>
  <button class="remove" aria-label={`Remove ${item.name}`} onclick={() => remove(item.id)}>×</button>
</li>
