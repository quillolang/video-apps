-- Whether a member's email shows on their page: no, unless they say so.
alter table members add column show_email integer not null default 0;
