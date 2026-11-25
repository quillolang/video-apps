defmodule StatePhoenixWeb.CountersLive do
  # Six kinds of state on one page, each with a +1.
  # A LiveView runs as a process on the server, one per open tab.
  use StatePhoenixWeb, :live_view
  alias StatePhoenix.{Counts, Everyone}

  def mount(_params, session, socket) do
    if connected?(socket), do: Phoenix.PubSub.subscribe(StatePhoenix.PubSub, "counts")

    {:ok,
     assign(socket,
       tab: 0,
       visitor: session["visitor"] || 0,
       everyone: Everyone.value(),
       saved: Counts.read("saved"),
       synced: Counts.read("synced")
     )}
  end

  # The address: ?n=, read whenever the URL changes.
  def handle_params(params, _uri, socket) do
    {:noreply, assign(socket, n: String.to_integer(params["n"] || "0"))}
  end

  def handle_event("tab", _, socket), do: {:noreply, update(socket, :tab, &(&1 + 1))}
