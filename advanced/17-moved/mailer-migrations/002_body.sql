-- Each email gets a body: the emails sent before it get an empty one.
alter table sent add column body text not null default '';
