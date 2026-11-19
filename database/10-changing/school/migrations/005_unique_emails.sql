-- One student per email from now on. Ana's family has its own address now, so the two are different first: a
-- unique index can't be made over a column that has the same value twice.
update students set email = 'reyes.family@example.com' where name = 'Ana Reyes';
create unique index students_email on students (email);
