-- A reset is kept as its token's SHA-256, until it's used or 30 minutes pass. Links from before stop working.
drop table resets;
create table resets (
    token_hash text primary key,
    member_id integer not null references members(id),
    expires_at text not null
);
