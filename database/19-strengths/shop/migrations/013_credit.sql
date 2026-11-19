-- Store credit, in dollars: numeric(8, 2) keeps exactly two decimals, so $0.10 is 0.10, never 0.1000000001. Sam has
-- $5.00 from a refund.
alter table customers add column credit numeric(8, 2) not null default 0;

update customers set credit = 5.00 where name = 'Sam Lee';
