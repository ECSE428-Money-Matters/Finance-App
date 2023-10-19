CREATE DATABASE MoneyMatters;

-- To Create a table:

CREATE TABLE account(
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255)

);

CREATE TABLE accountrecovery(
    accountrecoveryid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    code UUID DEFAULT gen_random_uuid(),
    creationDate timestamp DEFAULT NOW(),
    attempts int DEFAULT 3
);

-- Permissions Grants, must be last for permissions to be granted to every newly created tables
GRANT ALL ON DATABASE "MoneyMatters" TO "MoneyMatters";

GRANT TEMPORARY, CONNECT ON DATABASE "MoneyMatters" TO PUBLIC;

GRANT ALL ON DATABASE "MoneyMatters" TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "MoneyMatters";