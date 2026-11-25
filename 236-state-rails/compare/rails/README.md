# The six-counter page in Rails 8.1 + Hotwire

The page is app/views/counters/show.html.erb with app/controllers/counters_controller.rb; the tab's count is a
Stimulus controller (app/javascript/controllers/tab_controller.js). Kept in sync is a Turbo Stream broadcast over
Action Cable, which production runs on Solid Cable: the database carries the messages between server processes.

    bundle install
    export RAILS_ENV=production RAILS_FORCE_SSL=false SECRET_KEY_BASE=$(openssl rand -hex 64) STATE_DIR=$PWD/storage
    bin/rails db:prepare assets:precompile
    bin/rails server -p 3000                       # one Puma process
    WEB_CONCURRENCY=2 bin/rails server -p 3000     # two workers

SECRET_KEY_BASE encrypts the session cookie: a new one signs every visitor out. STATE_DIR holds the four SQLite files
(the app, cache, queue and cable). RAILS_FORCE_SSL=false is for plain HTTP on your own machine only.
