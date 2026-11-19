-- Tags on a ticket, with commas: "hardware, urgent".
alter table tickets add column tags text not null default '';
