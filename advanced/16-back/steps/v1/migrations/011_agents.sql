-- The team's agents, and what each may do: an admin may change the team's settings too.
create table agents (
    id integer primary key,
    name text not null unique,
    role text not null check (role in ('admin', 'agent'))
);

insert into agents (name, role) values ('Ana', 'admin'), ('Ben', 'agent'), ('Cara', 'agent'), ('Dev', 'agent');
