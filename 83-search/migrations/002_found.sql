-- A full-text index of the recipes' names (SQLite's FTS5), filled from the recipes already there.
create virtual table found using fts5(name, content='recipes', content_rowid='id');
insert into found (found) values ('rebuild');
