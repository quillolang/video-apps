-- Each article gets a readable address: its title in small letters, with dashes, "reset-your-password". Each one
-- once, since it's an address.
alter table articles add column slug text;

update articles set slug = lower(replace(title, ' ', '-'));

create unique index articles_slug on articles (slug);
