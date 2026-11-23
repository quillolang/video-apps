    // The list, one more added for this request, sorted, as fortunes.jsp.
    static void page(HttpServletRequest req, HttpServletResponse res, List<Fortune> list)
            throws ServletException, IOException {
        List<Fortune> all = new ArrayList<>(list);
        all.add(new Fortune(0, "Additional fortune added at request time."));
        all.sort(Comparator.comparing(Fortune::getMessage));
        req.setAttribute("fortunes", all);
        req.getRequestDispatcher("/WEB-INF/fortunes.jsp").forward(req, res);
    }
