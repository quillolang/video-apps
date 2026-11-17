-- Every failed log-in, with its name and when it came, to count the recent ones.
create table tries (name text not null, at integer not null);
create index tries_by_name on tries (name, at);
