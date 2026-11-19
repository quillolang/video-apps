-- The Bank's accounts: a balance in cents, from 0, and never below it.
create table accounts (
    id integer primary key,
    owner text not null,
    balance_cents integer not null default 0 check (balance_cents >= 0)
) strict;
