-- The Concert Hall's bookings: a seat at a show, for someone. One booking per seat, at each show.
create table bookings (
    id integer primary key,
    show text not null,
    seat text not null,
    name text not null,
    unique (show, seat)
) strict;
