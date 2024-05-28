const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
require('dotenv').config();

const port = process.env.PORT;
const secretKey = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

//rate limiter
const rateLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100, // Limit each IP to 100 requests
   message: {
      status: 429,
      message: "Too many requests from this IP, please try again after 15 minutes"
   }
});

app.use(rateLimiter);


// User registration
app.post("/users/register", async (req, res) => {
   const { username, email, password } = req.body;
   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
         "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING id;",
         [username, hashedPassword, email]
      );
      res.json(newUser.rows[0]);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// User login
app.post("/users/login", async (req, res) => {
   const { username, password } = req.body;
   try {
      const userResult = await pool.query(
         "SELECT * FROM users WHERE username=$1",
         [username]
      );
      const user = userResult.rows[0];
      if (!user || !await bcrypt.compare(password, user.password)) {
         return res.status(401).json({ error: 'Invalid username or password!' });
      }
      const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
      res.json({ token });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Authentication middleware
const authenticate = (req, res, next) => {
   const token = req.header('Authorization')?.split(' ')[1];
   if (!token) return res.status(401).json({ error: 'Access denied' });

   try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
   } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
   }
};

// Authorization middleware
const authorize = (roles = []) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
      next();
   };
};

// User profile
app.get("/users/profile", authenticate, async (req, res) => {
   const { userId } = req.user;
   try {
      const user = await pool.query(
         "SELECT * FROM users WHERE id=$1",
         [userId]
      );
      res.json(user.rows[0]);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Get all items with pagination
app.get("/items", async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const items = await pool.query('SELECT * FROM items LIMIT $1 OFFSET $2', [pageSize, offset]);
      const totalItemsResult = await pool.query('SELECT COUNT(*) FROM items');
      const totalItems = parseInt(totalItemsResult.rows[0].count);
      const totalPages = Math.ceil(totalItems / pageSize);
      res.json({
         items: items.rows,
         pagination: {
            totalItems,
            totalPages,
            currentPage: page,
            pageSize
         }
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get single item by ID
app.get("/items/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const item = await pool.query(
         "SELECT * FROM items WHERE id=$1",
         [id]
      );
      if (!item.rows.length) return res.status(404).json({ error: "Item with the given id not found!" });
      res.json(item.rows[0]);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Create new item
app.post("/items", authenticate, authorize(['admin', 'user']), upload.single('image'), async (req, res) => {
   const { name, description, starting_price, end_time } = req.body;
   const image_url = req.file ? req.file.path : null;
   try {
      const newItem = await pool.query(
         "INSERT INTO items (name, description, starting_price, current_price, image_url, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
         [name, description, starting_price, starting_price, image_url, end_time]
      );
      res.json(newItem.rows[0]);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Update item by ID
app.put("/items/:id", authenticate, authorize(['admin', 'user']), upload.single('image'), async (req, res) => {
   const { id } = req.params;
   const { name, description, starting_price, end_time } = req.body;
   const image_url = req.file ? req.file.path : null;
   try {
      const updatedItem = await pool.query(
         "UPDATE items SET name = $1, description = $2, starting_price = $3, end_time = $4, image_url = $5 WHERE id = $6 RETURNING *",
         [name, description, starting_price, end_time, image_url, id]
      );
      if (!updatedItem.rows.length) return res.status(404).json({ error: 'Item not found' });
      res.json(updatedItem.rows[0]);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Delete item by ID
app.delete("/items/:id", authenticate, authorize(['admin']), async (req, res) => {
   const { id } = req.params;
   try {
      const deletedItem = await pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
      if (!deletedItem.rows.length) return res.status(404).json({ error: 'Item not found' });
      res.json({ message: 'Item deleted' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Real-time bidding via Socket.io
io.on('connection', (socket) => {
   console.log('New client connected');

   socket.on('bid', (data) => {
      io.emit('update', data); // Notify all connected clients about the new bid
   });

   socket.on('notify', (data) => {
      io.emit('notify', data); // Send notifications to users in real-time
   });

   socket.on('disconnect', () => {
      console.log('Client disconnected');
   });
});

// Get bids for a specific item
app.get("/items/:itemId/bids", authenticate, async (req, res) => {
   const { itemId } = req.params;
   try {
      const bids = await pool.query('SELECT * FROM bids WHERE item_id = $1', [itemId]);
      res.json(bids.rows);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Place a new bid on an item
app.post("/items/:itemId/bids", authenticate, async (req, res) => {
   const { itemId } = req.params;
   const { bid_amount } = req.body;
   const userId = req.user.userId;
   try {
      const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
      const item = itemResult.rows[0];
      if (!item) return res.status(404).json({ error: 'Item not found' });
      if (bid_amount <= item.current_price) {
         return res.status(400).json({ error: 'Bid amount must be higher than the current price' });
      }
      const newBid = await pool.query(
         'INSERT INTO bids (item_id, user_id, bid_amount) VALUES ($1, $2, $3) RETURNING *',
         [itemId, userId, bid_amount]
      );
      await pool.query('UPDATE items SET current_price = $1 WHERE id = $2', [bid_amount, itemId]);

      io.emit('update', { itemId, bid_amount, userId });
      res.status(201).json(newBid.rows[0]);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get notifications for the logged-in user
app.get("/notifications", authenticate, async (req, res) => {
   const userId = req.user.userId;
   try {
      const notifications = await pool.query('SELECT * FROM notifications WHERE user_id = $1', [userId]);
      res.json(notifications.rows);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Mark notifications as read
app.post("/notifications/mark-read", authenticate, async (req, res) => {
   const userId = req.user.userId;
   try {
      await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
      res.json({ message: 'Notification marked as read' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

server.listen(port, () => {
   console.log('Server running at port', port);
});
