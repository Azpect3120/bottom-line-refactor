CREATE TYPE permission as ENUM ('Dev', 'Admin', 'User');
CREATE TYPE frequency as ENUM ('Monthly', 'Quarterly', 'Annually');
CREATE TYPE completed as ENUM ('checked', 'not-checked');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    table_name VARCHAR(255), -- clients
    action VARCHAR(255), -- INSERT, UPDATE, DELETE
    row_count BIGINT, -- 1
    statement VARCHAR(255), -- INSERT INTO clients ...
    arguments VARCHAR(255), -- arg1, arg2 (array joined to string)
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS salesTaxWorkload (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID,
    year VARCHAR(16),
    frequency frequency,
    jan completed,
    feb completed,
    mar completed,
    apr completed,
    may completed,
    jun completed,
    jul completed,
    aug completed,
    sep completed,
    oct completed,
    nov completed,
    dec completed,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
