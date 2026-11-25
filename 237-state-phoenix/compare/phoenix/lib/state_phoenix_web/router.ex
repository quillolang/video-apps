defmodule StatePhoenixWeb.Router do
  use StatePhoenixWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {StatePhoenixWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", StatePhoenixWeb do
    pipe_through :browser

    live "/", CountersLive
    post "/visitor", VisitorController, :add
  end

  # Other scopes may use custom stacks.
  # scope "/api", StatePhoenixWeb do
  #   pipe_through :api
  # end
end
