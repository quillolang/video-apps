    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        switch (req.getServletPath()) {
            case "/text" -> {
                res.setContentType("text/plain; charset=utf-8");
                res.getWriter().write("Hello, World!");
            }
            case "/json" -> {
                res.setContentType("application/json");
                res.getWriter().write("{\"message\":\"Hello, World!\"}");
            }
            case "/fortunes" -> page(req, res, FORTUNES);
            case "/db" -> page(req, res, fromDb());
            case "/compute" -> {
                res.setContentType("application/json");
                res.getWriter().write("{\"total\":" + work(10000) + "}");
            }
        }
    }
