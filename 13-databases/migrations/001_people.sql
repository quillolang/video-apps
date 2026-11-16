create table people (
    id integer primary key,
    name text not null unique,
    points integer not null default 0,
    budget integer not null default 3
);

insert into people (name) values ('Ada'), ('Grace'), ('Alan');
