-- Luigi's orders, with 64-bit ids, as a big system numbers them.
create table orders (
    id integer primary key,
    who text not null,
    pizza text not null
);
insert into orders (id, who, pizza) values
    (9007199254740992, 'Bob', 'Hawaiian'),
    (9007199254740993, 'Ada', 'Margherita');
