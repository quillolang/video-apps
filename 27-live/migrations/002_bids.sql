create table bids (
    id integer primary key,
    item integer not null references items (id),
    who text not null,
    amount integer not null
);
