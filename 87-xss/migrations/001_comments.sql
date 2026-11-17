-- The guestbook's comments, and the first one.
create table comments (id integer primary key, text text not null);
insert into comments (text) values ('Lovely mugs!');
