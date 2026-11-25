if unread() == 0 {
    span { "All read" }
} else if unread() == 1 {
    span { "1 new message" }
} else {
    strong { "{unread} new messages" }
}
