-- An email for each student, for their family. Maya and Ana are cousins, and their families gave the same one.
alter table students add column email text;

update students set email = 'cruz.family@example.com' where name = 'Maya Cruz';
update students set email = 'santos@example.com' where name = 'Leo Santos';
update students set email = 'cruz.family@example.com' where name = 'Ana Reyes';
update students set email = 'park@example.com' where name = 'Sam Park';
