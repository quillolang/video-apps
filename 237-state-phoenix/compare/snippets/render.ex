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
