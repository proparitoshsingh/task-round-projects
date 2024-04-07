CREATE DATABASE taskmanager;

CREATE TABLE tasks(
    task_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP 
);

CREATE TABLE creds(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);