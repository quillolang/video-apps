-- The recipe of the day: one row a day, picked by a job.
create table featured (
    day text primary key,  -- a date: "2026-11-18"
    recipe_id integer not null references recipes(id)
);
