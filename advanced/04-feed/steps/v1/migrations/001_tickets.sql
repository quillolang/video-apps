-- A team's tickets: each team has a database of its own, so no team column is needed.
create table tickets (
    id integer primary key,
    title text not null,
    status text not null default 'open',
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
