-- The team's settings: one row, made when the team starts.
create table settings (
    id integer primary key check (id = 1),
    display_name text not null
);
