-- Each order's reference at the card company: a big number, past 2^53. And last month's two orders, from the old
-- till, with theirs.
alter table orders add column ref bigint;   -- PostgreSQL's integer is 4 bytes, to about 2 billion: bigint is 8

update orders set ref = 9007199254740991 + 2 * id;

insert into orders (customer_id, placed, ref) values
    (1, '2026-10-28', 9007199254741101),
    (2, '2026-10-30', 9007199254741103);
insert into order_items (order_id, product_id, quantity) values
    ((select id from orders where ref = 9007199254741101), 2, 2),
    ((select id from orders where ref = 9007199254741103), 5, 1);
