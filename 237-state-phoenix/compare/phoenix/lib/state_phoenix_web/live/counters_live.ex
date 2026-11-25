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

  def handle_event("everyone", _, socket) do
    Everyone.add()
    {:noreply, assign(socket, everyone: Everyone.value())}
  end

  def handle_event("saved", _, socket) do
    Counts.add("saved")
    {:noreply, assign(socket, saved: Counts.read("saved"))}
  end

  def handle_event("synced", _, socket) do
    Counts.add("synced")
    Phoenix.PubSub.broadcast(StatePhoenix.PubSub, "counts", {:synced, Counts.read("synced")})
    {:noreply, socket}
  end

  # Kept in sync: every tab's process gets the broadcast, and LiveView sends its page the change.
  def handle_info({:synced, n}, socket), do: {:noreply, assign(socket, synced: n)}

  def render(assigns) do
    ~H"""
    <h1>Where state lives</h1>
    <button id="tab" phx-click="tab">This tab: {@tab}</button>
    <.link id="address" patch={~p"/?n=#{@n + 1}"}>The address: {@n}</.link>
    <.form for={%{}} action={~p"/visitor?n=#{@n}"}>
      <button id="visitor">This visitor: {@visitor}</button>
    </.form>
    <button id="everyone" phx-click="everyone">Everyone, until a restart: {@everyone}</button>
    <button id="saved" phx-click="saved">Everyone, for good: {@saved}</button>
    <button id="synced" phx-click="synced">Kept in sync: {@synced}</button>
    """
  end
end
