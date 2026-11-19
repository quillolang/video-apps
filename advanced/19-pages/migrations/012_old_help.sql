-- Before Help Desk, the help center was at /kb/article.php?id=12. Each old number, and the article that took its
-- place, so the old links still lead somewhere.
create table old_articles (
    old_id integer primary key,
    slug text not null
);

insert into old_articles (old_id, slug) values
    (12, 'reset-your-password'),
    (15, 'add-a-teammate'),
    (31, 'when-the-printer-jams');
