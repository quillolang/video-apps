defmodule StatePhoenix.Everyone do
  # Everyone, until a restart: one number in this node's memory, held by an Agent.
  use Agent

  def start_link(_), do: Agent.start_link(fn -> 0 end, name: __MODULE__)
  def value, do: Agent.get(__MODULE__, & &1)
  def add, do: Agent.update(__MODULE__, &(&1 + 1))
end
