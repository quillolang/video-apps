{#each todos as t (t.id)}
  {#if showDone || !t.done}
    <li>{t.text}</li>
  {/if}
{/each}
