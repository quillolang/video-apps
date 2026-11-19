create table trails (
    id integer primary key,
    name text not null,
    km real not null
);
insert into trails (name, km) values
    ('Coastal Path', 12.5),
    ('Fern Gully', 4.2),
    ('Ridge Loop', 8);
