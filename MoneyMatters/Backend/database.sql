CREATE DATABASE MoneyMatters;

-- To Create a table:

CREATE TABLE IF NOT EXISTS exampletable(
    example_id SERIAL PRIMARY KEY,
    description VARCHAR(255) -- Text field of max 255 characters
);

-- Users Table:
CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    hashed_password CHAR(60) NOT NULL
);