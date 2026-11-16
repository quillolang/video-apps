-- The recipe box, with three recipes to start.

create table recipes (
    id integer primary key,
    name text not null,
    minutes integer not null,
    ingredients text not null      -- one per line
);

insert into recipes (name, minutes, ingredients) values
    ('Lemon pasta', 15, 'pasta
lemon
butter
parmesan'),
    ('Shakshuka', 30, 'eggs
tomatoes
onion
paprika'),
    ('Banana pancakes', 20, 'banana
eggs
flour
milk');
