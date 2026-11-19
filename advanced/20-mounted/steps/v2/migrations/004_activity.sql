-- What happens on the team, in order: who did what, and when.
create table activity (
    id integer primary key,
    at text not null default (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    who text not null,
    what text not null
);
