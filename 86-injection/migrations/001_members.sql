-- Bookworm's members: who they are, when they joined, and each password's Argon2id hash.
create table members (
    id integer primary key,
    name text not null,
    email text not null,
    joined text not null,
    password_hash text not null
);
insert into members (name, email, joined, password_hash) values
    ('Ada', 'ada@bookworm.shop', '2025-03-14', '$argon2id$v=19$m=19456,t=2,p=1$hIExB87jstIiLawvTfWzYw$IGJuKsFYZFuDVfVpGWsWRnRI1lelviVozV9aKreWykk'),
    ('Grace', 'grace@bookworm.shop', '2025-06-02', '$argon2id$v=19$m=19456,t=2,p=1$JF2x6yp+WP+TcoDWz4jwkw$4RIv/h0yzmWEMZOP6NjhnVswG3SI0NA5cZo0HMYfPKg'),
    ('Linus', 'linus@bookworm.shop', '2025-09-21', '$argon2id$v=19$m=19456,t=2,p=1$oWx1e2p8cgvAS9rcu+t4ig$tn1DHmqm6CVDf2tp9JlK4g08mSyM5yTDRxM29mLX0nk'),
    ('Margaret', 'margaret@bookworm.shop', '2026-01-08', '$argon2id$v=19$m=19456,t=2,p=1$eFDFbGjXQUHRTNLyvDOZjw$X2QgDwV7Ml60PEQ+5pxXU25uq0KMwQfaG4pg5hXuLZg');
