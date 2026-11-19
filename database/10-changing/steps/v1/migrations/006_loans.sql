-- Loans: a book, out with a member, due back on a date. Each loan points at a book and at a member.
create table loans (
    id integer primary key,
    book_id integer not null references books (id),
    member_id integer not null references members (id),
    due text not null
) strict;

insert into loans (book_id, member_id, due) values
    (1, 1, '2026-12-01'),
    (6, 1, '2026-12-05'),
    (2, 3, '2026-12-03');
