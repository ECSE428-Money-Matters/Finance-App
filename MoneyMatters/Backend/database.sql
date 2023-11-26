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

CREATE TABLE IF NOT EXISTS expenses(
                                       expense_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                                       expense_name VARCHAR(255) NOT NULL,
                                       email VARCHAR(255) NOT NULL,
                                       amount NUMERIC(10, 2) NOT NULL,
                                       posted_date DATE NOT NULL,
                                       category VARCHAR(255) NOT NULL,
                                       optional_description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS incomes(
                                      income_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                                      income_name VARCHAR(255) NOT NULL,
                                      email VARCHAR(255) NOT NULL,
                                      amount NUMERIC(10, 2) NOT NULL,
                                      posted_date DATE NOT NULL,
                                      category VARCHAR(255) NOT NULL,
                                      optional_description VARCHAR(255),
                                      income_period INTEGER NOT NULL
);
-- Permissions Grants, must be last for permissions to be granted to every newly created tables
GRANT ALL ON DATABASE "moneymatters" TO "moneymatters";

GRANT TEMPORARY, CONNECT ON DATABASE "moneymatters" TO PUBLIC;

GRANT ALL ON DATABASE "moneymatters" TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "moneymatters";