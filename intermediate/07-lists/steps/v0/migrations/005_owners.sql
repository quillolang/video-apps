-- Who added each recipe. The four samples have no owner; recipes added from now on do.
alter table recipes add column user_id integer references users(id);
