CREATE TYPE permission as ENUM ('Dev', 'Admin', 'User');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    secret VARCHAR(255),
    permission permission
);