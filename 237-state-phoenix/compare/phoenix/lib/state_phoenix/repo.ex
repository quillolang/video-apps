defmodule StatePhoenix.Repo do
  use Ecto.Repo,
    otp_app: :state_phoenix,
    adapter: Ecto.Adapters.SQLite3
end
