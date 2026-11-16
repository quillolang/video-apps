create table items (
    id integer primary key,
    name text not null,
    start integer not null
);

insert into items (name, start) values
    ('A pottery class for two', 40),
    ('A rubber duck, signed by the mayor', 5),
    ('A weekend at the lake cabin', 200);
