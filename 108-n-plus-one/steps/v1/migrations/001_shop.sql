-- Luigi's shop: 1,000 customers and 10,000 orders.
create table customers (id integer primary key, name text not null);
create table orders (id integer primary key, customer_id int not null, total int not null);
with recursive n(i) as (select 1 union all select i + 1 from n where i < 1000)
insert into customers select i, 'Customer ' || i from n;
with recursive n(i) as (select 1 union all select i + 1 from n where i < 10000)
insert into orders select i, (i * 7919) % 1000 + 1, 8 + (i * 31) % 40 from n;
