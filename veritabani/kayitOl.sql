-- Database: anketweb

-- DROP DATABASE IF EXISTS anketweb;

CREATE DATABASE anketweb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL
);
INSERT INTO users (first_name, last_name, phone_number)
VALUES ('John', 'Doe', '1234567890');

SELECT * FROM users;




