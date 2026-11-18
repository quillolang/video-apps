-- The method: each recipe's steps, in order.
create table steps (
    id integer primary key,
    recipe_id integer not null references recipes(id),
    position integer not null,
    instruction text not null
);

insert into steps (recipe_id, position, instruction) values
    (1, 1, 'Whisk the flour and sugar in a bowl.'),
    (1, 2, 'Beat in the milk, eggs and melted butter until smooth.'),
    (1, 3, 'Cook spoonfuls in a hot pan until bubbles form, then flip.');
