-- Fernhill's trails. profile: the height in metres every half kilometre or so, for the drawing on a trail's page.
create table trails (
    id integer primary key,
    name text not null,
    level text not null,          -- easy, medium or hard
    km real not null,
    climb integer not null,       -- metres up, in all
    start text not null,          -- where it begins
    about text not null,
    profile text not null
);

insert into trails (name, level, km, climb, start, about, profile) values
('Millpond Loop', 'easy', 3.2, 40, 'the mill car park', 'A flat loop round the old millpond, with ducks, two benches and a café at the end.', '112,114,118,121,119,116,113,112'),
('Heron Marsh Walk', 'easy', 4.5, 25, 'Marsh Lane', 'Boardwalks over the marsh. Herons in the morning, and a hide halfway round.', '104,103,106,108,107,105,104,103,104'),
('Oak Hollow', 'medium', 6.8, 210, 'the church gate', 'Down into the hollow under old oaks, across the stream, and a steady climb back out.', '160,150,128,110,96,104,132,158,176,182,170,160'),
('Old Quarry Trail', 'medium', 8.4, 320, 'Quarry Road', 'Past the flooded quarry and up its rim, with views over the whole town.', '140,152,178,210,246,262,254,231,206,180,158,146,140'),
('Lantern Ridge', 'hard', 10.6, 540, 'the school car park', 'Along the ridge where the lanterns are lit in winter: narrow, rocky in places, and worth it.', '150,190,240,290,330,352,366,348,372,388,360,310,250,196,152'),
('Beacon Hill Summit', 'hard', 12.4, 690, 'the station', 'The long way to the beacon, the highest point in Fernhill. Bring water.', '96,120,158,204,256,312,368,420,466,498,512,490,438,370,300,226,160,110');
