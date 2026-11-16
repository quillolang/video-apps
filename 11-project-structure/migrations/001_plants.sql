create table plants (id integer primary key, name text not null, every integer not null, watered text not null);

insert into plants (name, every, watered) values
    ('Fern', 3, date('now', '-4 days')),
    ('Basil', 2, date('now', '-1 days')),
    ('Cactus', 14, date('now', '-9 days')),
    ('Monstera', 7, date('now', '-8 days'));
