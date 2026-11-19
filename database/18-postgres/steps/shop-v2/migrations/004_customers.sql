-- The shop's customers, and the rules every one of them keeps, whoever adds them. joined is a date, today unless
-- given.
create table customers (
    id integer generated always as identity primary key,
    name text not null,
    email text not null unique,
    joined date not null default current_date
);
