package bench;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

// The five answers as one servlet on Tomcat. The two pages go to fortunes.jsp (JSP with JSTL, which escapes).
// Java has no JSON in its standard library; the two fixed answers are written as text.
@WebServlet(urlPatterns = {"/text", "/json", "/fortunes", "/db", "/compute"})
public class Bench extends HttpServlet {
    static final List<Fortune> FORTUNES = List.of(
        new Fortune(1, "fortune: No such file or directory"),
        new Fortune(2, "A computer scientist is someone who fixes things that aren't broken."),
        new Fortune(3, "After enough decimal places, nobody gives a damn."),
        new Fortune(4, "A bad random number generator: 1, 1, 1, 1, 1, 4.33e+67, 1, 1, 1"),
        new Fortune(5, "A computer program does what you tell it to do, not what you want it to do."),
        new Fortune(6, "Emacs is a nice operating system, but I prefer UNIX. — Tom Christaensen"),
        new Fortune(7, "Any program that runs right is obsolete."),
        new Fortune(8, "A list is only as strong as its weakest link. — Donald Knuth"),
        new Fortune(9, "Feature: A bug with seniority."),
        new Fortune(10, "Computers make very fast, very accurate mistakes."),
        new Fortune(11, "<script>alert(\"This should not be displayed in a browser alert box.\");</script>"),
        new Fortune(12, "フレームワークのベンチマーク"));

    // One SQLite connection for each server thread, kept open, its query prepared once.
    static final ThreadLocal<PreparedStatement> QUERY = ThreadLocal.withInitial(() -> {
        try {
            Connection db = DriverManager.getConnection("jdbc:sqlite:" + System.getProperty("bench.db"));
            return db.prepareStatement("select id, message from fortune");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    });

    static int work(int n) {
        long total = 0;
        for (long i = 0; i < n; i++) total = (total + i * i) % 1000003;
        return (int) total;
    }

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

    // The list, one more added for this request, sorted, as fortunes.jsp.
    static void page(HttpServletRequest req, HttpServletResponse res, List<Fortune> list)
            throws ServletException, IOException {
        List<Fortune> all = new ArrayList<>(list);
        all.add(new Fortune(0, "Additional fortune added at request time."));
        all.sort(Comparator.comparing(Fortune::getMessage));
        req.setAttribute("fortunes", all);
        req.getRequestDispatcher("/WEB-INF/fortunes.jsp").forward(req, res);
    }

    static List<Fortune> fromDb() throws ServletException {
        List<Fortune> list = new ArrayList<>();
        try (ResultSet rows = QUERY.get().executeQuery()) {
            while (rows.next()) list.add(new Fortune(rows.getInt(1), rows.getString(2)));
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        return list;
    }
}
