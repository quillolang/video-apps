-- The Library's members. An email is optional: not everyone gave one, so the column may be null.
create table members (
    id integer primary key,
    name text not null,
    joined text not null,
    email text
) strict;

insert into members (name, joined, email) values
    ('Ada Brooks', '2024-01-15', 'ada@example.com'),
    ('Tom Reyes', '2024-03-02', null),
    ('Lia Novak', '2024-05-20', 'lia@example.com'),
    ('Omar Haddad', '2025-02-11', null);
