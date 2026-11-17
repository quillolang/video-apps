create table orders (id integer primary key, item text not null, paid int not null default 0);
insert into orders (id, item) values (42, 'Margherita'), (43, 'Funghi');
create table events (id text primary key);
