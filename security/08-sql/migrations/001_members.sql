-- The members: who can post. The role says who runs the board.
create table members (
    id integer primary key,
    name text not null,
    email text not null unique,
    password text not null,
    role text not null default 'member',
    joined_at text not null default current_timestamp
);
