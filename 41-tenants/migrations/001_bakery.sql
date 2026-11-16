-- One bakery's own tables: made in each bakery's database.

create table bakery (
    title text not null
);

create table breads (
    id integer primary key,
    name text not null,
    price text not null,
    stock integer not null default 12
);
