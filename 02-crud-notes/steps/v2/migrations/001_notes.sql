-- The notes.
create table notes (
    id integer primary key,
    title text not null,
    body text not null default '',
    created_at text not null default current_timestamp
);
