# The six-counter page in Blazor (.NET 11, Interactive Server)

The page is Components/Pages/Home.razor; Services/Everyone.cs and Services/Counts.cs hold the server's counts.
The visitor's count is in the browser's local storage, encrypted with ASP.NET Core's Data Protection keys
(ProtectedLocalStorage); KEYS_DIR says where the keys are kept. Kept in sync is an event in the server process.

    dotnet publish -c Release -o out
    cd out
    ASPNETCORE_ENVIRONMENT=Production STATE_DB=$PWD/state.db KEYS_DIR=$PWD/keys dotnet StateBlazor.dll --urls http://127.0.0.1:5000

Run it from out/ (its content root), or the static files, Blazor's script among them, come back empty.
