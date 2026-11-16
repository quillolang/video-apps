-- Focus sessions, logged by everyone who uses the board.
create table sessions (
    id integer primary key,
    at text not null default current_timestamp
);
