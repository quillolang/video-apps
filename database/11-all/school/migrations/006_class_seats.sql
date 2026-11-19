-- How many seats each class has left. Math and Science seat three, Art and Music two; the students already in a
-- class have theirs. Never below zero.
alter table classes add column seats_left integer not null default 0 check (seats_left >= 0);

update classes set seats_left =
    (case when name in ('Math', 'Science') then 3 else 2 end)
    - (select count(*) from enrollments where enrollments.class_id = classes.id);
