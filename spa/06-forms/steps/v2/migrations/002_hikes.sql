-- The hikes people log: which trail, which day, how long it took, and a note.
create table hikes (
  id integer primary key,
  trail_id integer not null references trails(id),
  day text not null,
  minutes integer not null,
  note text not null default ''
);
