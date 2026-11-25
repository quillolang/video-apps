defmodule StatePhoenix.Application do
  # See https://elixir.hexdocs.pm/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      StatePhoenixWeb.Telemetry,
      StatePhoenix.Repo,
      {Ecto.Migrator,
       repos: Application.fetch_env!(:state_phoenix, :ecto_repos), skip: skip_migrations?()},
      {DNSCluster, query: Application.get_env(:state_phoenix, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: StatePhoenix.PubSub},
      StatePhoenix.Everyone,
      # Start to serve requests, typically the last entry
      StatePhoenixWeb.Endpoint
    ]

    # See https://elixir.hexdocs.pm/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: StatePhoenix.Supervisor]
    result = Supervisor.start_link(children, opts)

    # Two nodes on one machine: CLUSTER_PEERS="b@127.0.0.1" connects them (Erlang distribution), so PubSub
    # broadcasts reach both. Across machines, DNS_CLUSTER_QUERY does the same.
    for peer <- String.split(System.get_env("CLUSTER_PEERS", ""), ",", trim: true) do
      Node.connect(String.to_atom(peer))
    end
    result
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    StatePhoenixWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp skip_migrations?() do
    # By default, sqlite migrations are run when using a release
    System.get_env("RELEASE_NAME") == nil
  end
end
