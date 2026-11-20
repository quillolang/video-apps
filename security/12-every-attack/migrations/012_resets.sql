-- Password resets: the token in each emailed link, and whose password it resets.
create table resets (
    token text primary key,
    member_id integer not null references members(id)
);
