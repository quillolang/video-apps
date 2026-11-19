-- Replies, found by their ticket. Without it, counting one ticket's replies reads every reply.
create index replies_ticket on replies (ticket_id);
