// ---- the server's side ----------------------------------------------------------------------------------

#[cfg(feature = "ssr")]
fn trails() -> Vec<Trail> {
    serde_json::from_str(include_str!("../data/trails.json")).unwrap()
}

#[cfg(feature = "ssr")]
fn reviews() -> Vec<Review> {
    serde_json::from_str(include_str!("../data/reviews.json")).unwrap()
}

#[server]
pub async fn list_trails() -> Result<Vec<Trail>, ServerFnError> {
    Ok(trails())
}

#[server]
pub async fn load_trail(id: u32) -> Result<Option<Trail>, ServerFnError> {
    Ok(trails().into_iter().find(|t| t.id == id))
}

#[server]
pub async fn load_reviews(id: u32) -> Result<Vec<Review>, ServerFnError> {
    Ok(reviews().into_iter().filter(|r| r.trail == id).collect())
}

// ---- the page and the routes ------------------------------------------------------------------------------

pub fn shell(options: LeptosOptions) -> impl IntoView {
