CREATE TYPE permission as ENUM ('Dev', 'Admin', 'User');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    secret VARCHAR(255),
    permission permission
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID,
    account_name VARCHAR(255),
    account_user VARCHAR(255),
    account_password VARCHAR(255),
    account_notes TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);