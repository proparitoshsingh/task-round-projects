const express=require('express');
const app=express();
const pool=require('./db');
const port=3000;
const cors=require('cors');

app.use(cors());
app.use(express.json());

app.post("/api/v1/add",async(req,res)=>{
    try{
        const {email,description,start_date,end_date}=req.body;
        const newTask=await pool.query(
            "INSERT INTO tasks (email,description,start_date,end_date) VALUES($1,$2,$3,$4) RETURNING task_id;;",
            [email,description,start_date,end_date]
        );
        const task_id=newTask.rows[0].task_id;
        console.log(newTask);
        res.send({task_id});
    }catch(err){
        console.log(err.message);
    }
});

app.post("/api/v1/delete",async(req,res)=>{
    try{
        const {id}=req.body;
        const newTask=await pool.query(
            "DELETE FROM tasks WHERE task_id=$1;",
            [id]
        );
        console.log(newTask);
        res.send(newTask);
    }catch(err){
        console.log(err.message);
    }
});

app.post("/api/v1/edit",async(req,res)=>{
    try{
        const {id,description}=req.body;
        const newTask=await pool.query(
            "UPDATE tasks SET description = $2 WHERE task_id = $1;",
            [id,description]
        );
        console.log(newTask);
        res.send(newTask);
    }catch(err){
        console.log(err.message);
    }
});

app.get("/api/v1/tasks",async(req,res)=>{
    try{
        const tasks=await pool.query(
            "SELECT * FROM tasks;"
        );
        res.send(tasks.rows);
    }catch(err){
        console.log(err.message);
    }
});


app.listen(port,()=>{
    console.log("Sever running at port ",port);
})