-- Every movement of money in or out of an account, in cents: in is positive, out is negative. Ada's month.
create table movements (
    id integer generated always as identity primary key,
    account_id integer not null references accounts (id),
    day date not null,
    what text not null,
    cents integer not null
);

insert into movements (account_id, day, what, cents) values
    (1, '2026-11-02', 'Opening deposit', 20000),
    (1, '2026-11-03', 'Rent', -3500),
    (1, '2026-11-06', 'Groceries', -1200),
    (1, '2026-11-10', 'Refund', 2500),
    (1, '2026-11-14', 'Bike repair', -4500),
    (1, '2026-11-17', 'Books', -1300);
