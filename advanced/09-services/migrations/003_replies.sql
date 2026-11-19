-- A ticket's replies: who wrote what, and when.
create table replies (
    id integer primary key,
    ticket_id integer not null references tickets(id),
    author text not null,
    body text not null,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
