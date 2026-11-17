create table voters (
    movie_id integer not null,
    name text not null,
    primary key (movie_id, name)
);
