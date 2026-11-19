-- What each group paid for its seats, $25 a seat, in cents. A payment goes in with the seats it pays for.
create table payments (
    id integer primary key,
    name text not null,
    seats text not null,
    cents integer not null check (cents > 0)
) strict;
