--CREATE DATABASE MoneyMatters;

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
    hashed_password VARCHAR(60) NOT NULL
);

CREATE TABLE accountrecovery(
    accountrecoveryid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    code UUID DEFAULT gen_random_uuid(),
    creationDate timestamp DEFAULT NOW(),
    attempts int DEFAULT 3
);

CREATE TABLE IF NOT EXISTS expenses(
    expense_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expense_name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    posted_date DATE NOT NULL,
    category VARCHAR(255) NOT NULL,
    optional_description VARCHAR(255)
);

-- Permissions Grants, must be last for permissions to be granted to every newly created tables
GRANT ALL ON DATABASE "MoneyMatters" TO "MoneyMatters";

GRANT TEMPORARY, CONNECT ON DATABASE "MoneyMatters" TO PUBLIC;

GRANT ALL ON DATABASE "MoneyMatters" TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "MoneyMatters";

