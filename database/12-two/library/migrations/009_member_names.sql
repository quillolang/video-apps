-- Each member's first and last name, for "Dear Ada" letters and for sorting by last name: two new columns, filled
-- from the name we have, split at its first space. The name column stays, so every page that reads it still works.
alter table members add column first_name text;
alter table members add column last_name text;

update members set
    first_name = substr(name, 1, instr(name, ' ') - 1),
    last_name = substr(name, instr(name, ' ') + 1);
