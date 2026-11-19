-- The Clinic's patients: who they are, and how to reach them.
create table patients (
    id integer primary key,
    name text not null,
    birthday text not null,
    phone text not null
) strict;

insert into patients (name, birthday, phone) values
    ('Rosa Lim', '1984-06-02', '555-0142'),
    ('Ben Okafor', '1990-12-17', '555-0177'),
    ('Ivy Chen', '2001-03-09', '555-0103');
