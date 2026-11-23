-- One row: how many times the page's button was pressed.
create table likes (id integer primary key, n integer not null);
insert into likes (id, n) values (1, 0);
