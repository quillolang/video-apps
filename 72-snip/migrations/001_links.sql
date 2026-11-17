-- Each short link: its code, the long link it stands for, and how many times it was followed.
create table links (
    code text primary key,
    url text not null,
    clicks integer not null default 0
);
