-- Each loaf in a basket, one row each: adding is an insert, so two at once both land.
create table loaves (id integer primary key, basket text not null, loaf text not null);
