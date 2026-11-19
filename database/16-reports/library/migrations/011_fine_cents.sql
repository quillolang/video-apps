-- Fines in whole cents, an integer: exact, however many are added up. The dollars column stays (lesson 10).
alter table fines add column fine_cents integer not null default 0;

update fines set fine_cents = cast(round(fine * 100) as integer);
