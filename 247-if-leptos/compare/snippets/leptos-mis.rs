Effect::new(move |_| {
    if running.get() {
        set_interval(move || *set_ticks.write() += 1, Duration::from_millis(speed.get()));
    }
});
