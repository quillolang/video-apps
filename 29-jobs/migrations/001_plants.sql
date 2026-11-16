create table plants (
    id integer primary key,
    name text not null,
    emoji text not null,
    every_ms integer not null,
    watered integer not null default 0,
    thirsty integer not null default 0
);

insert into plants (name, emoji, every_ms) values
    ('Fern', '🌿', 15000),
    ('Basil', '🌱', 25000),
    ('Spike the cactus', '🌵', 600000);
