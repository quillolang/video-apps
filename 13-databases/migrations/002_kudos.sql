create table kudos (
    id integer primary key,
    giver integer not null references people (id),
    taker integer not null references people (id),
    note text not null
);
