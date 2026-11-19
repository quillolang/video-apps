-- Incidents: something wrong for everyone (email down, the site slow), and where it stands. Agents post them from
-- the desk; customers see them on the status page.
create table incidents (
    id integer primary key,
    title text not null,
    status text not null default 'investigating' check (status in ('investigating', 'resolved')),
    created_at text not null default (datetime('now'))
);
