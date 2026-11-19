<script lang="ts">
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

{#if form?.joined}
  <p>Welcome, {form.joined}!</p>
{:else}
  <form method="POST">
    {#if form?.notWhole}
      <p>Age must be a whole number</p>
    {/if}
    {#if form?.tooYoung}
      <p>You must be 13 or older</p>
    {/if}
    <input name="email" type="email"
      value={form?.email ?? ''} required>
    <input name="age" type="number" required>
    <button>Join</button>
  </form>
{/if}
