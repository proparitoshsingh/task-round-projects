# Real-Time Bidding Platform

## Introduction
This is a comprehensive RESTful API for a real-time bidding platform built using Node.js, Express, Socket.io, and PostgreSQL. The API supports advanced CRUD operations, user authentication, role-based access control, real-time bidding, and notifications.

## Features
- User registration and authentication with JWT.
- Role-based access control for users and admins.
- CRUD operations for auction items.
- Real-time bidding using WebSockets.
- Real-time notifications for bids and outbid alerts.
- Image upload for auction items.
- Pagination, search, and filtering for auction items.
- Comprehensive error handling and validation.
- Rate limmiting to prevent API from being exploited.

## Environment Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/proparitoshsingh/real-time-bidding-platform.git
    cd real-time-bidding-platform
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file with the following variables:
    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret
    ```

4. Run the database migrations:
    ```bash
    # Create tables in PostgreSQL locally
    psql -U yourusername -d yourdatabase -a -f database.sql
    ```

5. Start the development server:
    ```bash
    npm dev 
    ```
    Or the normal server :
    ```bash
    npm start
   ```

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (String, unique, not null)
- `password` (String, not null)
- `email` (String, unique, not null)
- `role` (String, default to 'user') // roles: 'user', 'admin'
- `created_at` (Timestamp, default to current time)

### Items Table
- `id` (Primary Key)
- `name` (String, not null)
- `description` (Text, not null)
- `starting_price` (Decimal, not null)
- `current_price` (Decimal, default to starting_price)
- `image_url` (String, nullable) // for storing image paths
- `end_time` (Timestamp, not null) // auction end time
- `created_at` (Timestamp, default to current time)

### Bids Table
- `id` (Primary Key)
- `item_id` (Foreign Key referencing items.id)
- `user_id` (Foreign Key referencing users.id)
- `bid_amount` (Decimal, not null)
- `created_at` (Timestamp, default to current time)

### Notifications Table
- `id` (Primary Key)
- `user_id` (Foreign Key referencing users.id)
- `message` (String, not null)
- `is_read` (Boolean, default to false)
- `created_at` (Timestamp, default to current time)

## API Endpoints

### Users
- **POST /api/auth/register** - Register a new user.
- **POST /api/auth/login** - Authenticate a user and return a token.
- **GET /api/auth/profile** - Get the profile of the logged-in user.

### Items
- **GET /api/items** - Retrieve all auction items (with pagination).
- **GET /api/items/:id** - Retrieve a single auction item by ID.
- **POST /api/items** - Create a new auction item. (Authenticated users, image upload)
- **PUT /api/items/:id** - Update an auction item by ID. (Authenticated users, only item owners or admins)
- **DELETE /api/items/:id** - Delete an auction item by ID. (Authenticated users, only item owners or admins)

### Bids
- **GET /api/items/:itemId/bids** - Retrieve all bids for a specific item.
- **POST /api/items/:itemId/bids** - Place a new bid on a specific item. (Authenticated users)

### Notifications
- **GET /api/notifications** - Retrieve notifications for the logged-in user.
- **POST /api/notifications/mark-read** - Mark notifications as read.

## WebSocket Events

### Bidding
- **connection** - Establish a new WebSocket connection.
- **bid** - Place a new bid on an item.
- **update** - Notify all connected clients about a new bid on an item.

### Notifications
- **notify** - Send notifications to users in real-time.

## Authentication and Authorization
- Use JWT (JSON Web Tokens) for authentication.
- Implement role-based access control to restrict access to certain endpoints based on user roles.
- Protect the POST, PUT, and DELETE endpoints appropriately.

## Validation and Error Handling
- Validate incoming data for required fields.
- Handle and return appropriate HTTP status codes and messages for errors (e.g., 400 for bad requests, 401 for unauthorized, 403 for forbidden, 404 for not found).

## Image Upload
- Implement image upload functionality for auction items using a library like multer.
- Store image URLs in the database.

## Search and Filtering
- Implement search functionality for auction items.
- Allow filtering items by status (e.g., active, ended).

## Pagination
- Implement pagination for the GET /items endpoint.

## Notifications
- Implement a notification system to notify users about bids on their items and when they are outbid.


## Testing
Add unit and integration tests for the API using a testing framework like Mocha, Chai, or Jest.

