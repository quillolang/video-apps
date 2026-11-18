-- The meal plan: which recipe a member will cook on which day, and for how many.
create table plans (
    id integer primary key,
    user_id integer not null references users(id),
    day text not null,  -- a date: "2026-11-18"
    recipe_id integer not null references recipes(id),
    servings integer not null
);
