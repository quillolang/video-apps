# Everyone, for good: a row per count in the database.
class Count < ApplicationRecord
  def self.read(name) = find_by!(name:).n
  def self.add(name) = where(name:).update_all("n = n + 1")
end
