let _ticker = use_future(move || async move {
    if !running() {
        return;
    }
    let ms = speed();
    loop {
        TimeoutFuture::new(ms).await;
        ticks += 1;
    }
});
