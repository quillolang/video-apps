-- Each article's version: 1 to start with, one more each time it changes. The article's etag names it, so a
-- changed article is a new etag.
alter table articles add column version integer not null default 1;
