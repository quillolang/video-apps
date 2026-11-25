# Everyone, until a restart: one number in this server process's memory.
module Everyone
  COUNT = Concurrent::AtomicFixnum.new(0)
  def self.value = COUNT.value
  def self.add = COUNT.increment
end
