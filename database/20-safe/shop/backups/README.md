Backups of the shop's PostgreSQL database land here:
`pg_dump -Fc -h localhost -p 5432 -U you shop -f backups/shop.dump`. Restore one into a new database with createdb
and pg_restore, and look at it, before you need it.
