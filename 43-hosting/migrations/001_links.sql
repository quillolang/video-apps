-- Short links: a code, and where it goes.

create table links (
    code text primary key,
    url text not null,
    visits integer not null default 0
);
