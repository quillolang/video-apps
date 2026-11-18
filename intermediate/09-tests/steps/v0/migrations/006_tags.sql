-- Tags, and which recipes have which: many to many, through a table in between.
create table tags (
    id integer primary key,
    name text not null unique
);

create table recipe_tags (
    recipe_id integer not null references recipes(id),
    tag_id integer not null references tags(id),
    primary key (recipe_id, tag_id)  -- each pair once
);

insert into tags (name) values ('breakfast'), ('quick'), ('sweet'), ('dinner');
insert into recipe_tags (recipe_id, tag_id) values
    (1, 1), (1, 2), (1, 3),  -- Fluffy Pancakes: breakfast, quick, sweet
    (2, 1), (2, 3),          -- Banana Bread: breakfast, sweet
    (3, 4),                  -- Tomato Soup: dinner
    (4, 2), (4, 4);          -- Veggie Fried Rice: quick, dinner
