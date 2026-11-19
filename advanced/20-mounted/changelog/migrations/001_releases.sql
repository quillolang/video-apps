-- Help Desk's releases, and what each brought: the same for every team.
create table releases (
    id integer primary key,
    version text not null,
    day text not null,
    notes text not null
);

insert into releases (version, day, notes) values
    ('1.4', '2026-11-02', 'Tickets switch without reloads, and Back brings the last one back.'),
    ('1.5', '2026-11-09', 'A feed and a sitemap for the help center.'),
    ('1.6', '2026-11-16', 'A status page for your customers, at /status.');
