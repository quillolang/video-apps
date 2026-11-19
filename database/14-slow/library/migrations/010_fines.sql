-- Late fines: ten cents for each day a book comes back late. Ada was a day late, Lia two.
create table fines (
    id integer primary key,
    member_id integer not null references members (id),
    fine real not null
) strict;

insert into fines (member_id, fine) values (1, 0.1), (3, 0.2);
