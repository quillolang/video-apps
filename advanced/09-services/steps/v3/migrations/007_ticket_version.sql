-- Which version of a ticket this is: 1 to start, one more each time it's saved.
alter table tickets add column version integer not null default 1;
