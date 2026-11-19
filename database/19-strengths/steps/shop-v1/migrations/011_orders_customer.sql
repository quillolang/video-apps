-- A customer's orders, found without reading them all: an index on customer_id, the orders kept in customer order.
create index orders_customer on orders (customer_id);
