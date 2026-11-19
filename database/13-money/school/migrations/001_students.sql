-- The School's students. A birthday is text, written year-month-day, so it sorts as dates do.
create table students (
    id integer primary key,
    name text not null,
    year_level integer not null,
    birthday text not null
) strict;

insert into students (name, year_level, birthday) values
    ('Maya Cruz', 7, '2013-04-12'),
    ('Leo Santos', 8, '2012-09-30'),
    ('Ana Reyes', 7, '2013-01-05'),
    ('Sam Park', 9, '2011-11-21');
