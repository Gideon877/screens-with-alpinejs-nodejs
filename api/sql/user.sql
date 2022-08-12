create table users
(
    id serial not null primary key,
    username text,
    first_name text,
    last_name text,
    password text,
    active boolean default true,
    role text default 'USER'
);