create table members (id integer primary key, name text not null, email text not null,
  password_hash text not null, joined date not null);
-- Made-up members; each password_hash is crypto.hash_password's (Argon2id).
insert into members (name, email, password_hash, joined) values
  ('Nia', 'nia@example.com', '$argon2id$v=19$m=19456,t=2,p=1$2jSR2E4ZZC0zRJLqQhXqTQ$p4jthb7DYLCn+ZNB7xZaPIl2zuqcWirWF/JAXbN9P8I', '2026-03-02'),
  ('Omar', 'omar@example.com', '$argon2id$v=19$m=19456,t=2,p=1$GoXf47SZXBKYQKysg1xXQw$RPs7+lPSA3Js5DunsSUo6SbUuiBx8PRuDK+xbXDwkYw', '2026-05-17'),
  ('Lee', 'lee@example.com', '$argon2id$v=19$m=19456,t=2,p=1$3g+A8fhtj9xCZHE+E5IpMQ$I47/JeGyONwUZUQ10YQ/tmjOHOef4eU3RiM1YoWH9Gw', '2026-09-08');
