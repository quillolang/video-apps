-- Each student's grade in each class, out of 100: one more column on the table in between.
alter table enrollments add column grade integer;

update enrollments set grade = 92 where student_id = 1 and class_id = 1;
update enrollments set grade = 85 where student_id = 1 and class_id = 2;
update enrollments set grade = 78 where student_id = 2 and class_id = 1;
update enrollments set grade = 88 where student_id = 2 and class_id = 3;
update enrollments set grade = 95 where student_id = 3 and class_id = 2;
update enrollments set grade = 90 where student_id = 3 and class_id = 4;
update enrollments set grade = 81 where student_id = 4 and class_id = 3;
