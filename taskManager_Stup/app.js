const express = require('express');
const app = express();
const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT;
const secretKey = process.env.secretKey;

app.use(cors());
app.use(express.json());

app.post("/api/v1/add", async (req, res) => {
    try {
        const { email, description, start_date, end_date } = req.body;
        const newTask = await pool.query(
            "INSERT INTO tasks (email,description,start_date,end_date) VALUES($1,$2,$3,$4) RETURNING task_id;;",
            [email, description, start_date, end_date]
        );
        const task_id = newTask.rows[0].task_id;
        console.log(newTask);
        res.send({ task_id });
    } catch (err) {
        console.log(err.message);
    }
});

app.post("/api/v1/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const newTask = await pool.query(
            "DELETE FROM tasks WHERE task_id=$1;",
            [id]
        );
        console.log(newTask);
        res.send(newTask);
    } catch (err) {
        console.log(err.message);
    }
});

app.post("/api/v1/edit", async (req, res) => {
    try {
        const { id, description } = req.body;
        const newTask = await pool.query(
            "UPDATE tasks SET description = $2 WHERE task_id = $1;",
            [id, description]
        );
        console.log(newTask);
        res.send(newTask);
    } catch (err) {
        console.log(err.message);
    }
});

app.post("/api/v1/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        //add a query to run through the login table and match the creds
        const details = await pool.query(
            "SELECT * FROM creds WHERE username=$1",
            [username]
        );
        console.log(details);
        const user = details.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(!bcrypt.compareSync(password,user.password)){
            return res.status(401).json({message:'Wrong Password'});
        }

        const token = jwt.sign({ id: user.user_id, username: user.username,
            exp: Math.floor(Date.now()/1000)+(60*60)}, secretKey);
        res.json({ 'token': token,'email': user.email});
    } catch (err) {
        console.log(err.message);
    }
});

app.post("/api/v1/register",async (req, res)=>{
    const{username,password,email}=req.body;
    try {
        const hashedPassword=await bcrypt.hash(password,10);
        const result=await pool.query(
            'INSERT INTO creds (email,username,password) VALUES($1,$2,$3) RETURNING *',
            [email,username,hashedPassword]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({message:'Internal server error'});
    }
});


app.get("/api/v1/tasks", verifyToken, async (req, res) => {
    const email=req.query.email;
    try {
        const tasks = await pool.query(
            "SELECT * FROM tasks WHERE email = $1 ORDER BY task_id ASC;",
            [email]
        );
        res.send(tasks.rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Invalid token, please try to login again' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token, please try to login again' });
        }
        req.user = decoded;
        next();
    });
}

app.get('/api/v1/check',async(req,res)=>{
    const {username,email}=req.query;
    try {
        const usernamequery=await pool.query(
            "SELECT * FROM creds WHERE username = $1",
            [username]
        );
        const emailquery=await pool.query(
            "SELECT * FROM creds WHERE email = $1",
            [email]
        );
        const usernameExists=usernamequery.rows.length>0;
        const emailExists=emailquery.rows.length>0;
        res.json({usernameExists,emailExists});
    } catch (err) {
        console.log("Error while checking for existing username and email!");
        res.status(500).json({message:"Internal Server error "});
    }
});


app.listen(port, () => {
    console.log("Sever running at port ", port);
})