-- Accounts: everyone who signs up. Each email has one account; the password is kept only as a hash.
create table users (
    id integer primary key,
    name text not null,
    email text not null unique,
    password_hash text not null
);
