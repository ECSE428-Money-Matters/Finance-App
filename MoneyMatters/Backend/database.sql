--CREATE DATABASE MoneyMatters;

-- To Create a table:

-- Users Table:
CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS accountrecovery(
    accountrecoveryid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    code UUID DEFAULT gen_random_uuid(),
    creationDate timestamp DEFAULT NOW(),
    attempts int DEFAULT 3
);

-- Permissions Grants, must be last for permissions to be granted to every newly created tables
GRANT ALL ON DATABASE "moneymatters" TO "moneymatters";

GRANT TEMPORARY, CONNECT ON DATABASE "moneymatters" TO PUBLIC;

GRANT ALL ON DATABASE "moneymatters" TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "moneymatters";