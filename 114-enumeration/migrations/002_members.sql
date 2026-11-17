-- The members: Ada (sourdough-42), Sam (croissant!) and Kim (rye-and-honey).
-- Their password_hash is crypto.hash_password's, Argon2id with a salt of its own.
insert into users (name, email, password_hash) values
  ('Ada', 'ada@example.com', '$argon2id$v=19$m=19456,t=2,p=1$BYOtkdKqPvXJkEsqCM/4PQ$xIPEVEgrtgBe3aNaoky8x6qlm4Or94w9XV0BPPfsFUI'),
  ('Sam', 'sam@example.com', '$argon2id$v=19$m=19456,t=2,p=1$137AWWGaF33BsT62HckT5A$/G4zRryPNTt7leamB/BRXVh/9m1CawOtAgJAFz41GJc'),
  ('Kim', 'kim@example.com', '$argon2id$v=19$m=19456,t=2,p=1$ttAmQ/Ur4CXIDSIg7wNkzw$S8XNdWz5SFYeCSxQO+wSapYfUM25hD8gxEEKNvuNk+o');
