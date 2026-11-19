-- The shop's customers, and the rules every one of them keeps, whoever adds them.
create table customers (
    id integer primary key,
    name text not null,
    email text not null unique,
    joined text not null default (date('now'))
) strict;
