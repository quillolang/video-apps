-- Each member's sessions carry this number. Adding one to it signs that member out everywhere.
alter table members add column session_version integer not null default 1;
