-- Full-text search of the notes: an index of their words, each cut to its stem ("running" is "run"). It reads the
-- notes from appointments (content=), and is filled from them once.
create virtual table notes_search using fts5(notes, content=appointments, content_rowid=id, tokenize='porter');
insert into notes_search(notes_search) values ('rebuild');

-- And kept up to date: when a note is added, removed or changed, so is its entry.
create trigger notes_added after insert on appointments begin
    insert into notes_search(rowid, notes) values (new.id, new.notes);
end;

create trigger notes_removed after delete on appointments begin
    insert into notes_search(notes_search, rowid, notes) values ('delete', old.id, old.notes);
end;

create trigger notes_changed after update of notes on appointments begin
    insert into notes_search(notes_search, rowid, notes) values ('delete', old.id, old.notes);
    insert into notes_search(rowid, notes) values (new.id, new.notes);
end;
