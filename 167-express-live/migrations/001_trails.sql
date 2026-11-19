create table trails (
    id integer primary key,
    name text not null,
    status text not null
);
insert into trails (name, status) values
    ('Coastal Path', 'open'),
    ('Fern Gully', 'muddy'),
    ('Ridge Loop', 'open');
