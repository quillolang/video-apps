-- The mail service's table, as lesson 6 made it: kept as it is when it's already there.
create table if not exists sent (id integer primary key, to_addr text not null, subject text not null);
