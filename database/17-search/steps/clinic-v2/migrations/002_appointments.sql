-- Appointments: a patient's, at a time. Each one points at a patient.
create table appointments (
    id integer primary key,
    patient_id integer not null references patients (id),
    at text not null
) strict;

insert into appointments (patient_id, at) values
    (1, '2026-12-02 09:00'),
    (3, '2026-12-02 10:30'),
    (1, '2026-12-09 09:00');
