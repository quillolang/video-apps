    // One SQLite connection for each server thread, kept open, its query prepared once.
    static final ThreadLocal<PreparedStatement> QUERY = ThreadLocal.withInitial(() -> {
        try {
            Connection db = DriverManager.getConnection("jdbc:sqlite:" + System.getProperty("bench.db"));
            return db.prepareStatement("select id, message from fortune");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    });
