-- The Library's books: a row for each title, and how many copies it has.
create table books (
    id integer primary key,
    title text not null,
    author text not null,
    year integer not null,
    copies integer not null default 1
) strict;

insert into books (title, author, year, copies) values
    ('Pride and Prejudice', 'Jane Austen', 1813, 3),
    ('Frankenstein', 'Mary Shelley', 1818, 2),
    ('Moby-Dick', 'Herman Melville', 1851, 1),
    ('Little Women', 'Louisa May Alcott', 1868, 2),
    ('The Time Machine', 'H. G. Wells', 1895, 4);
