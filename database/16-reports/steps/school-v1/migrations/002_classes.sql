-- The School's classes, and who takes which. A student takes many classes, and a class has many students,
-- so they meet in a table in between: one row for each student in each class. Its primary key is the pair,
-- so a student is in a class once.
create table classes (
    id integer primary key,
    name text not null unique
) strict;

create table enrollments (
    student_id integer not null references students (id),
    class_id integer not null references classes (id),
    primary key (student_id, class_id)
) strict;

insert into classes (name) values ('Math'), ('Art'), ('Science'), ('Music');

insert into enrollments (student_id, class_id) values
    (1, 1), (1, 2),
    (2, 1), (2, 3),
    (3, 2), (3, 4),
    (4, 3);
