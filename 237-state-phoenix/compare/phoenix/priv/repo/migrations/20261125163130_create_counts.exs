defmodule StatePhoenix.Repo.Migrations.CreateCounts do
  # Everyone, for good: two counts, "saved", and "synced" for the one kept in sync.
  use Ecto.Migration

  def change do
    create table(:counts, primary_key: false) do
      add :name, :string, primary_key: true
      add :n, :integer, null: false, default: 0
    end

    execute "insert into counts (name, n) values ('saved', 0), ('synced', 0)", ""
  end
end
