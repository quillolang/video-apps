-- A doctor's day: an index by doctor, and within each doctor by start time. The column compared with = comes
-- first, the range (from this day to the next) last.
create index appointments_doctor_time on appointments (doctor_id, starts_at);
