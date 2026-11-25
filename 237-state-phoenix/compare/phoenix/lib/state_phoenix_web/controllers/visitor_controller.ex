defmodule StatePhoenixWeb.VisitorController do
  # This visitor: the session is a signed cookie, and a LiveView can't set cookies,
  # so this +1 is a plain form post to a controller.
  use StatePhoenixWeb, :controller

  def add(conn, params) do
    conn
    |> put_session(:visitor, (get_session(conn, :visitor) || 0) + 1)
    |> redirect(to: ~p"/?n=#{params["n"] || "0"}")
  end
end
