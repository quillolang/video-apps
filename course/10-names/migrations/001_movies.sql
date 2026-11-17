create table movies (
    id integer primary key,
    title text not null,
    year integer not null,
    minutes integer not null
);

insert into movies (title, year, minutes) values
    ('The Last Pancake', 2019, 104),
    ('Space Llamas', 2023, 96),
    ('Robots in Love', 1998, 121),
    ('The Quiet Lighthouse', 2011, 132),
    ('Midnight Bakery', 2021, 88);
