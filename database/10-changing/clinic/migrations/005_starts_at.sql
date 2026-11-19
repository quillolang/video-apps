-- An appointment's time is when it starts: "at" becomes "starts_at". Every query that names the old column must
-- change with it.
alter table appointments rename column at to starts_at;
