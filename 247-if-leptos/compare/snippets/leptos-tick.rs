Effect::new(move |_| {
    if running.get() {
        let handle = set_interval_with_handle(
            move || *set_ticks.write() += 1,
            Duration::from_millis(speed.get()),
        )
        .unwrap();
        on_cleanup(move || handle.clear());
    }
});
// ...
<Show when=move || running.get()>
    <input placeholder="A note, while it runs" aria-label="Note"/>
</Show>
