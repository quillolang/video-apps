-- Ana joins Math, and takes its last seat, with the same grade as Maya.
insert into enrollments (student_id, class_id, grade) values (3, 1, 92);

update classes set seats_left = seats_left - 1 where name = 'Math';
