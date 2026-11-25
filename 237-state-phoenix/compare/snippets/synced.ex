  def handle_event("synced", _, socket) do
    Counts.add("synced")
    Phoenix.PubSub.broadcast(StatePhoenix.PubSub, "counts", {:synced, Counts.read("synced")})
    {:noreply, socket}
  end

  # Kept in sync: every tab's process gets the broadcast, and LiveView sends its page the change.
  def handle_info({:synced, n}, socket), do: {:noreply, assign(socket, synced: n)}
