# The six-counter page in Laravel 13 + Livewire 4

The page is one single-file Livewire component, resources/views/pages/⚡counters.blade.php, routed in routes/web.php.
SQLite holds the sessions, the cache and the counts (Laravel's defaults: SESSION_DRIVER and CACHE_STORE are
"database"). There is no .env: give APP_KEY and DB_DATABASE as environment variables.

    composer install
    export APP_KEY=base64:$(openssl rand -base64 32) DB_DATABASE=$PWD/state.db
    php artisan migrate --force
    php artisan serve --port=8000                               # one PHP worker
    PHP_CLI_SERVER_WORKERS=2 php artisan serve --port=8000      # two

APP_KEY encrypts Laravel's cookies, the session's among them: a new key signs every visitor out.
