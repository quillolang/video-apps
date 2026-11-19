-- A member found by email however it was typed. The index on email can't help `lower(email) = ?`, so this one
-- keeps lower(email), the very expression the query asks about.
create index members_email_lower on members (lower(email));
