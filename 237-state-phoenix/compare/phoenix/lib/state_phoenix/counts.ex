defmodule StatePhoenix.Counts do
  # Everyone, for good: a row per count in SQLite.
  import Ecto.Query
  alias StatePhoenix.Repo

  def read(name), do: Repo.one!(from c in "counts", where: c.name == ^name, select: c.n)
  def add(name), do: Repo.update_all(from(c in "counts", where: c.name == ^name), inc: [n: 1])
end
