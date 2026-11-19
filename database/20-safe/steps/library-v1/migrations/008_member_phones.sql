-- A phone number for members, for when a book they asked for comes in. Nobody has given one yet but Ada and Lia,
-- so the column may be null.
alter table members add column phone text;

update members set phone = '555-0101' where name = 'Ada Brooks';
update members set phone = '555-0133' where name = 'Lia Novak';
