CREATE DATABASE MoneyMatters;
-- Permissions Grants
GRANT ALL ON DATABASE "MoneyMatters" TO "MoneyMatters";

GRANT TEMPORARY, CONNECT ON DATABASE "MoneyMatters" TO PUBLIC;

GRANT ALL ON DATABASE "MoneyMatters" TO postgres;

-- To Create a table:

CREATE TABLE exampletable(
    example_id SERIAL PRIMARY KEY,
    description VARCHAR(255) -- Text field of max 255 characters
);
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
    creationDate DATE DEFAULT CURRENT_DATE,
    attempts int DEFAULT 3
);