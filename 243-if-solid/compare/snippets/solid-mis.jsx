createEffect(
  () => [running(), speed()],
  ([on, ms]) => {
    if (!on) return;
    const id = setInterval(() => setTicks((t) => t + 1), ms);
    onCleanup(() => clearInterval(id));
  },
);
