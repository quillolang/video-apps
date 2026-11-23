// Text: a String alone would go out as JSON, in quotes.
#[get("/text")]
async fn text() -> Result<Text<String>> {
    Ok(Text("Hello, World!".to_string()))
}

#[get("/json")]
async fn json() -> Result<Message> {
    Ok(Message { message: "Hello, World!".to_string() })
}
