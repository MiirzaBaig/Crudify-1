console.log("Hello" + " " + "Executed before server");

const { error } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const { reset } = require("nodemon");
const app = express();  



app.get("/", (req, res) => {
    
    res.send("Once again hello from server")
    console.log("Hello Executing inside server")
})

// Connecting to a database and starting the server
// Connect to MongoDB

mongoose.connect("mongodb+srv://admin:1234@cluster0.taefg.mongodb.net/todo-listapp?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Connected to Database...!")
    app.listen(3000, () => {
      console.log(`server is running at http://localhost:3000`);
    });
})
.catch(() => {
    console.log("Connection failed...!")
})
 



// Define a schema for the to-do item
const todoschema = new mongoose.Schema({
   title:{
       type: String,
       required: true
   },
   description:{
        type: String,
        required: true
   },
    completed:{
       type: Boolean,
       required: true
    }
    
})

// create a model based on the schema
const Todo = mongoose.model("Todo", todoschema)

// Middleware to parse JSON requests
app.use(express.json())

//GET route to fetch all to-do items
app.get("/todos", (req, res) => {
    Todo.find()
    .then((todos) => {
      res.json(todos);
    })
    .catch((error) => {
      res.status(500).json({error: "Failed to fetch todos..."})
    })
})

// POST route to create a new to-do item
app.post("/todos", (req, res) => {
    const {title, description, completed } = req.body;
    const todo = new Todo({
       title, 
       description,
       completed
    })
    todo.save()
    .then(() => {
      res.status(201).json(`{message: "Todo created successfully!"}`)
      console.log("Todo created successfully")
    })
    .catch((error) => {
      res.status(500).json(`{error: "Failed to create todo..."}`)
    }) 
})

// DELETE route to delete a to-do item
app.delete("/todos/:id",  (req, res) => {
  const { id } =  req.params;
  Todo.findByIdAndDelete(id)
  .then(() => {
    res.json({message: "Todo deleted successfully!"})
  })
  .catch((error) => {
    res.status(500).json({error:" failed to delete todo..."})
  })
})

// PUT route to update a to-do item 
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body 
  Todo.findByIdAndUpdate(id, {title, description, completed})
  .then(() => {
    res.json({message: "Todo updated successfully!"})
  })
  .catch((error) => {
    res.status(500).json(`{error: "failed to update todo..."}`)
    console.log(error)
  })
})

// PATCH route to update a to-do item
// app.patch(")
