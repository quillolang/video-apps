let _ticker = use_resource(move || async move {
    if !running() {
        return;
    }
    let ms = speed();
    loop {
        TimeoutFuture::new(ms).await;
        ticks += 1;
    }
});
// ...
if running() {
    input { placeholder: "A note, while it runs", aria_label: "Note" }
}
