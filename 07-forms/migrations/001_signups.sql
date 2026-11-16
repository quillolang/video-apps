-- Sign-ups for the workshop.
create table signups (
    id integer primary key,
    name text not null,
    email text not null,
    seats integer not null,
    ticket text not null
);
