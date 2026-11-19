-- The team's help center: articles that answer what customers ask most, each at an address of its own.
create table articles (
    id integer primary key,
    title text not null,
    body text not null
);

insert into articles (title, body) values
    ('Reset your password', 'On the sign-in page, choose "Forgot password", and follow the link we email you.'),
    ('Add a teammate', 'In Settings, choose "Team", then "Invite", and type their email address.'),
    ('Change your team name', 'In Settings, type the new name and choose Save. Your address stays the same.'),
    ('When the printer jams', 'Open the front door, pull the stuck page out slowly, and close the door again.'),
    ('Our support hours', 'We answer tickets from 8 in the morning to 6 in the evening, Monday to Friday.');
