#[get("/api/trails")]
async fn list_trails() -> Result<Vec<Trail>, ServerFnError> {
    Ok(trails())
}

#[post("/api/trail")]
async fn load_trail(id: u32) -> Result<Option<Trail>, ServerFnError> {
    Ok(trails().into_iter().find(|t| t.id == id))
}

#[post("/api/reviews")]
async fn load_reviews(id: u32) -> Result<Vec<Review>, ServerFnError> {
    Ok(reviews().into_iter().filter(|r| r.trail == id).collect())
}
