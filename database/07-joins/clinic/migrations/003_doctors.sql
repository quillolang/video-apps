-- The Clinic's doctors, and each appointment's doctor.
create table doctors (
    id integer primary key,
    name text not null
) strict;

insert into doctors (name) values ('Dr. Ruiz'), ('Dr. Osei'), ('Dr. Lin');

alter table appointments add column doctor_id integer references doctors (id);
update appointments set doctor_id = 1 where id in (1, 3);
update appointments set doctor_id = 2 where id = 2;
