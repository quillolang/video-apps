-- The allotment's notebook: rain in each month, and each tomato plant's height each week.
create table rain (year integer not null, month integer not null, mm integer not null, primary key (year, month));
create table growth (plant text not null, week integer not null, cm integer not null, primary key (plant, week));
