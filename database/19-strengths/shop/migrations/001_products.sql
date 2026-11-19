-- The Corner Shop's products: one row each. PostgreSQL makes each id itself, one more each time: an identity.
create table products (
    id integer generated always as identity primary key,
    name text not null,
    price_cents integer not null,
    in_stock integer not null default 0
);
