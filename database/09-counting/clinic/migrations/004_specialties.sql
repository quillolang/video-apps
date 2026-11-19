-- What each doctor does. A doctor can have more than one specialty, and a specialty more than one doctor, so
-- they meet in a table in between, and the pair is its primary key.
create table specialties (
    id integer primary key,
    name text not null unique
) strict;

create table doctor_specialties (
    doctor_id integer not null references doctors (id),
    specialty_id integer not null references specialties (id),
    primary key (doctor_id, specialty_id)
) strict;

insert into specialties (name) values ('Family medicine'), ('Pediatrics'), ('Cardiology'), ('Dermatology');

insert into doctor_specialties (doctor_id, specialty_id)
    select doctors.id, specialties.id from doctors, specialties
    where (doctors.name = 'Dr. Ruiz' and specialties.name in ('Family medicine', 'Pediatrics'))
       or (doctors.name = 'Dr. Osei' and specialties.name = 'Cardiology')
       or (doctors.name = 'Dr. Lin' and specialties.name in ('Pediatrics', 'Dermatology'));
