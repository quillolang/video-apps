-- A neighbourhood to start with: Rosa runs the board, Ana and Ben post on it.
insert into members (id, name, email, password, role) values
    (1, 'Rosa', 'rosa@example.com', 'sunflower42', 'admin'),
    (2, 'Ana', 'ana@example.com', 'tomato-soup', 'member'),
    (3, 'Ben', 'ben@example.com', 'blue-bike-7', 'member');

insert into listings (owner_id, title, condition, description) values
    (2, 'Kids'' bike, 16 inch', 'good', 'Red, with training wheels. Outgrown!'),
    (3, 'Box of paperbacks', 'worn', 'About 30 novels, mostly mysteries.'),
    (2, 'Desk lamp', 'new', 'Still in its box: a gift that didn''t fit.'),
    (1, 'Tomato seedlings', 'new', 'Six pots, ready to plant.');
