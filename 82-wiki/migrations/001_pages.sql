-- Every save of every page: the latest row for a name is the page, and the rest are its history.
create table pages (id integer primary key, name text not null, body text not null, at text not null);
create index pages_by_name on pages (name, id);
