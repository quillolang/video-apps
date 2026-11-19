-- Who wrote each book. A book can have more than one author, and an author more than one book, so they meet
-- in a table in between: one row for each book and each of its authors, and the pair is its primary key. The
-- books' author column stays, as the cover prints it.
create table authors (
    id integer primary key,
    name text not null unique
) strict;

create table book_authors (
    book_id integer not null references books (id),
    author_id integer not null references authors (id),
    primary key (book_id, author_id)
) strict;

-- The authors of the books so far, one each.
insert into authors (name) select distinct author from books order by author;
insert into book_authors (book_id, author_id)
    select books.id, authors.id from books join authors on authors.name = books.author;

-- Two more books by Neil Gaiman, one of them with Terry Pratchett.
insert into books (title, author, year, copies) values
    ('Good Omens', 'Terry Pratchett and Neil Gaiman', 1990, 2),
    ('Coraline', 'Neil Gaiman', 2002, 1);
insert into authors (name) values ('Terry Pratchett'), ('Neil Gaiman');
insert into book_authors (book_id, author_id)
    select books.id, authors.id from books, authors
    where (books.title = 'Good Omens' and authors.name in ('Terry Pratchett', 'Neil Gaiman'))
       or (books.title = 'Coraline' and authors.name = 'Neil Gaiman');
