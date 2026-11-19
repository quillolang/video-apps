-- The Bank's accounts: a balance in cents, from 0, and never below it. PostgreSQL makes each id itself.
create table accounts (
    id integer generated always as identity primary key,
    owner text not null,
    balance_cents integer not null default 0 check (balance_cents >= 0)
);
