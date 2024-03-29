CREATE DATABASE taskmanager;

CREATE TABLE tasks(
    task_id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP 
);