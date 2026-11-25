createEffect(
  () => [running(), speed()],
  ([on, ms]) => {
    if (!on) return;
    const id = setInterval(() => setTicks((t) => t + 1), ms);
    return () => clearInterval(id);
  },
);
// ...
<button onClick={() => setRunning(!running())}>{running() ? 'Stop' : 'Start'}</button>
<button onClick={() => setSpeed(speed() / 2)}>Faster</button>
<p class="out">{ticks()} ticks</p>
<Show when={running()}>
  <input placeholder="A note, while it runs" aria-label="Note" />
</Show>
