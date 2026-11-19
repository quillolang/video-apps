-- A member's loans, soonest due first: an index by member, and within each member by due date. The column the
-- query compares with = comes first; the one it sorts by, next.
create index loans_member_due on loans (member_id, due);
