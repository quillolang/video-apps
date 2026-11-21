#[derive(Params, PartialEq)]
struct TrailParams {
    id: Option<u32>,
}

/// The trail's id from the address, or None when it isn't a number.
fn trail_id() -> impl Fn() -> Option<u32> + Copy + Send + Sync + 'static {
    let params = use_params::<TrailParams>();
    move || params.read().as_ref().ok().and_then(|p| p.id)
}
