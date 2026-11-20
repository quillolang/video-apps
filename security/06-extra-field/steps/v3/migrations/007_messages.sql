-- Messages about a listing: who wrote, to whom, and what they said.
create table messages (
    id integer primary key,
    listing_id integer not null references listings(id),
    from_id integer not null references members(id),
    to_id integer not null references members(id),
    body text not null,
    sent_at text not null default current_timestamp
);
