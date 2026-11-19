-- Who's waiting for a product that's sold out, in the order they asked.
create table waitlist (
    id integer generated always as identity primary key,
    product_id integer not null references products (id),
    name text not null
);
