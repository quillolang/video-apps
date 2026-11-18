#!/bin/sh
# A fresh list in the database file $1, before its app starts: Eggs, Bread (bought) and Apples.
set -e
rm -f "$1" "$1-wal" "$1-shm"
sqlite3 "$1" "create table items (id integer primary key, name text not null, bought integer not null default 0);
insert into items (name, bought) values ('Eggs', 0), ('Bread', 1), ('Apples', 0);"
