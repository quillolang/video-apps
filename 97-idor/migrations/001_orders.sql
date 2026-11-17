-- Luigi's orders: who ordered, what, and where it goes.
create table orders (
    id integer primary key,
    customer text not null,
    pizza text not null,
    address text not null
);
insert into orders (id, customer, pizza, address) values
    (41, 'Bob', 'Pepperoni', '12 Elm Street'),
    (42, 'Ada', 'Margherita', '5 Oak Lane');
