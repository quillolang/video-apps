-- The shelves a product is on. A product can be on more than one, and a shelf has many products, so they meet
-- in a table in between, and the pair is its primary key.
create table categories (
    id integer primary key,
    name text not null unique
) strict;

create table product_categories (
    product_id integer not null references products (id),
    category_id integer not null references categories (id),
    primary key (product_id, category_id)
) strict;

insert into categories (name) values ('Dairy'), ('Bakery'), ('Breakfast'), ('Drinks'), ('Fruit');

insert into product_categories (product_id, category_id)
    select products.id, categories.id from products, categories
    where (products.name = 'Milk' and categories.name in ('Dairy', 'Breakfast', 'Drinks'))
       or (products.name = 'Bread' and categories.name in ('Bakery', 'Breakfast'))
       or (products.name = 'Eggs, a dozen' and categories.name in ('Dairy', 'Breakfast'))
       or (products.name = 'Apples, 1 kg' and categories.name = 'Fruit')
       or (products.name in ('Coffee', 'Tea') and categories.name in ('Breakfast', 'Drinks'));
