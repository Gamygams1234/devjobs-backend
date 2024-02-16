require("dotenv").config();

const express = require("express")

const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const mongoURI = process.env.MONGOURI;
const PORT = process.env.PORT || 5000;


app.get("/",(req, res)=>{
    res.send("Hello")
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });