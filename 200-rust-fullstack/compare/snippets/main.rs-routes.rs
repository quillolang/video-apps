#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
enum Route {
    #[layout(Layout)]
        #[route("/")]
        Home {},
        #[nest("/trails/:id")]
            #[layout(TrailPage)]
                #[route("/")]
                Overview { id: u32 },
                #[route("/reviews")]
                Reviews { id: u32 },
            #[end_layout]
        #[end_nest]
        #[route("/:..segments")]
        NotFound { segments: Vec<String> },
}
