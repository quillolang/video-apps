-- Each ticket keeps the id of its email's call, made later, to ask after it.
alter table tickets add column email_call text;
