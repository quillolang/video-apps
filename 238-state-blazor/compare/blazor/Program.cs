using Microsoft.AspNetCore.DataProtection;
using StateBlazor.Components;
using StateBlazor.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<Everyone>();
builder.Services.AddSingleton<Counts>();

// The keys that encrypt the visitor's storage, in KEYS_DIR: a restart keeps them, and a new folder is a new secret.
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Environment.GetEnvironmentVariable("KEYS_DIR") ?? "keys"))
    .SetApplicationName("StateBlazor");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
