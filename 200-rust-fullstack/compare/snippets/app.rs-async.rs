                <Routes fallback=|| view! { <Missing what="No such page"/> }>
                    <Route path=path!("/") view=Home ssr=SsrMode::Async/>
                    <ParentRoute path=path!("/trails/:id") view=TrailPage ssr=SsrMode::Async>
                        <Route path=path!("") view=Overview/>
                        <Route path=path!("reviews") view=Reviews/>
                    </ParentRoute>
                </Routes>
