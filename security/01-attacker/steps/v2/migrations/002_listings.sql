-- What members give away: a title, its condition, a few words, and who it belongs to.
create table listings (
    id integer primary key,
    owner_id integer not null references members(id),
    title text not null,
    condition text not null,
    description text not null default '',
    posted_at text not null default current_timestamp
);
