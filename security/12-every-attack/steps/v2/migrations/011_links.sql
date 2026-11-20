-- A link for each listing (the shop's page, say), with its preview: the page's title and first paragraph.
alter table listings add column link text;
alter table listings add column link_title text;
alter table listings add column link_text text;
