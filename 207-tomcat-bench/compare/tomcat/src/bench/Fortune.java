package bench;

// A fortune, with the getters JSP's expression language reads.
public class Fortune {
    private final int id;
    private final String message;

    public Fortune(int id, String message) { this.id = id; this.message = message; }
    public int getId() { return id; }
    public String getMessage() { return message; }
}
