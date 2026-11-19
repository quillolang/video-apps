-- Three more days of orders, earlier in the month, so there's a day to group by.
insert into orders (customer_id, placed) values
    (1, '2026-11-16'), (2, '2026-11-16'),
    (1, '2026-11-17'),
    (2, '2026-11-18'), (1, '2026-11-18'), (2, '2026-11-18');

insert into order_items (order_id, product_id, quantity) values
    (3, 1, 2), (3, 2, 1),
    (4, 5, 1),
    (5, 6, 2), (5, 3, 1),
    (6, 1, 1),
    (7, 2, 2), (7, 4, 1),
    (8, 5, 2);
