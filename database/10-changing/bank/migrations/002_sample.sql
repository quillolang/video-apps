-- Three accounts. Cara's has no balance given: the default, 0, goes in.
insert into accounts (owner, balance_cents) values
    ('Ada Brooks', 12000),
    ('Ben Okafor', 300);
insert into accounts (owner) values ('Cara Diaz');
