import reflex as rx

config = rx.Config(
    app_name="inbox",
    frontend_port=8134,
    backend_port=8134,
    telemetry_enabled=False,
    plugins=[rx.plugins.SitemapPlugin()],
)
