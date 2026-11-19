-- Orders: each one a customer's, with its items, each item a product. An order's items go with it.
create table orders (
    id integer generated always as identity primary key,
    customer_id integer not null references customers (id),
    placed date not null default current_date
);

create table order_items (
    id integer generated always as identity primary key,
    order_id integer not null references orders (id) on delete cascade,
    product_id integer not null references products (id),
    quantity integer not null check (quantity > 0)
);

-- Two customers, and their first orders.
insert into customers (name, email) values ('Sam Lee', 'sam@example.com'), ('Kim Park', 'kim@example.com');
insert into orders (customer_id) values (1), (2);
insert into order_items (order_id, product_id, quantity) values (1, 1, 2), (1, 2, 1), (2, 5, 1);
