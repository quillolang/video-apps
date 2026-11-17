-- The pancake orders, and where each one is: ordered, cooking (on the griddle) or served.
create table orders (
    id integer primary key,
    who text not null,
    what text not null,
    stage text not null default 'ordered' check (stage in ('ordered', 'cooking', 'served'))
);
