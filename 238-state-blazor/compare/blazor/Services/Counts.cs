using Microsoft.Data.Sqlite;

namespace StateBlazor.Services;

// Everyone, for good: a row per count in SQLite. Kept in sync: an event that every open page listens to.
public class Counts
{
    readonly string db = $"Data Source={Environment.GetEnvironmentVariable("STATE_DB") ?? "state.db"}";
    public event Action<int>? SyncedChanged;

    public Counts() => Run("create table if not exists counts (name text primary key, n int not null);" +
                           "insert or ignore into counts values ('saved', 0), ('synced', 0)");

    public int Read(string name) => Convert.ToInt32(Run("select n from counts where name = $name", name));

    public int Add(string name)
    {
        Run("update counts set n = n + 1 where name = $name", name);
        var n = Read(name);
        if (name == "synced") SyncedChanged?.Invoke(n);
        return n;
    }

    object? Run(string sql, string? name = null)
    {
        using var connection = new SqliteConnection(db);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = sql;
        if (name != null) command.Parameters.AddWithValue("$name", name);
        return command.ExecuteScalar();
    }
}
