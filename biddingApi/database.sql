CREATE DATABASE bidding;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(40) NOT NULL,
    email VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    starting_price DECIMAL(10, 2) NOT NULL,
    current_price DECIMAL(10, 2) DEFAULT starting_price,
    image_url VARCHAR(255),
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id),
    user_id INTEGER REFERENCES users(id),
    bid_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);