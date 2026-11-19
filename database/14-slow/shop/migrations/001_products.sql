-- The Corner Shop's products: one row each.
create table products (
    id integer primary key,
    name text not null,
    price_cents integer not null,
    in_stock integer not null default 0
) strict;
