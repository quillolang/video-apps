# Everyone, for good: two counts, "saved", and "synced" for the one kept in sync.
class CreateCounts < ActiveRecord::Migration[8.1]
  def change
    create_table :counts do |t|
      t.string :name, null: false, index: { unique: true }
      t.integer :n, null: false, default: 0
    end
    reversible { |dir| dir.up { execute "insert into counts (name, n) values ('saved', 0), ('synced', 0)" } }
  end
end
