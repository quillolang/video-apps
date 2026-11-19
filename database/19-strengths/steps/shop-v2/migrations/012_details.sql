-- What a product is like, which differs from product to product: jsonb, JSON that PostgreSQL keeps parsed and can
-- search. And its tags, a list in one column: an array of text.
alter table products add column details jsonb not null default '{}';
alter table products add column tags text[] not null default '{}';

update products set tags = '{organic,fairtrade}',
    details = '{"origin": "Kenya", "roast": "dark", "grind": "whole bean"}' where name = 'Coffee';
update products set tags = '{organic}', details = '{"origin": "India", "caffeine": true}' where name = 'Tea';
update products set tags = '{fresh,local}', details = '{"fat": "2%", "litres": 1}' where name = 'Milk';
update products set tags = '{fresh,local}',
    details = '{"grain": "whole wheat", "sliced": true}' where name = 'Bread';
update products set tags = '{local}',
    details = '{"size": "large", "free_range": true}' where name = 'Eggs, a dozen';
