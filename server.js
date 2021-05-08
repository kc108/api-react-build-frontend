// DEPENDENCIES
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT=3000 } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");


// DATABASE CONNECTION
// Establish Connection
mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
})
 const db = mongoose.connection
 db.on("open", () => {
     console.log("connected to DB")
 })

 db.on("error", (error) => {
    console.log(error)
 })

 db.on("closed", () => {
     console.log("connection closed")
 })

// MODELS
const PeopleSchema = new mongoose.Schema({
    name: String, 
    image: String, 
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

// MIDDLEWARE
// to prevent cors errors, open access to all origins
app.use(cors()); 
// logging
app.use(morgan("dev")); 
// parse json bodies
app.use(express.json()); 

// ROUTES
// Create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});

// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // PEOPLE CREATE ROUTE
  app.post("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  // PEOPLE UPDATE ROUTE
  app.put("/people/:id", async (req, res) => {
      try {
          // block of code to try
          // send all people 
          res.json(
              await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
          );
      } catch(error) {
          // block of code to handle errors
          // send error
          res.status(400).json(error);
      }
  });

  // PEOPLE DELETE ROUTE
  app.delete("/people/:id", async (req, res) => {
      try {
          // block of code to try
          // send all people
          res.json(await People.findByIdAndRemove(req.params.id));
      } catch(error) {
          // block of code to handle errors
          res.status(400).json(error);
      }
  });


// LISTENER
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));