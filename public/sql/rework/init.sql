CREATE TYPE permission as ENUM ('Dev', 'Admin', 'User');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT,
    permission permission
);