-- Recipes, and the ingredients each one needs: one to many.
create table recipes (
    id integer primary key,
    title text not null,
    servings integer not null default 2,
    minutes integer not null
);

create table ingredients (
    id integer primary key,
    recipe_id integer not null references recipes(id),  -- whose it is
    name text not null,
    amount text not null,  -- exact, as written: "1.5"
    unit text not null default ''
);
