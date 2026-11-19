-- The doctors' notes on each appointment: what the patient came with, and what to do. This week's, with notes.
alter table appointments add column notes text;

insert into appointments (patient_id, doctor_id, starts_at, notes) values
    (1, 1, '2026-11-16 09:00', 'Knee pain after running. Ice, rest, and no running for a week.'),
    (2, 2, '2026-11-16 10:30', 'Ran a fever overnight; fluids and rest.'),
    (3, 3, '2026-11-17 09:30', 'Rash after brunch, likely the shellfish.'),
    (1, 2, '2026-11-17 11:00', 'Runny nose and a cough for three days.'),
    (2, 1, '2026-11-18 09:00', 'Runs every morning; ankle sore since Monday.'),
    (3, 2, '2026-11-18 14:00', 'Headache and a fever; back in two days if it stays.'),
    (1, 3, '2026-11-19 10:00', 'Sprained wrist from a fall while jogging.'),
    (2, 3, '2026-11-19 15:30', 'Check-up: all well.');
