-- Who bought what at the counter's new online shop, one row a purchase. And Coffee, nearly gone: one bag left.
create table purchases (
    id integer generated always as identity primary key,
    product_id integer not null references products (id),
    name text not null
);

update products set in_stock = 1 where name = 'Coffee';
