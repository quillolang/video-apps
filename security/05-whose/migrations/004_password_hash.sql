-- From now on the column holds a hash of the password, never the password itself.
alter table members rename column password to password_hash;
