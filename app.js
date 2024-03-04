require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const accountRoutes = require("./routes/accounts");
const jobRoutes = require("./routes/jobs");
var cors = require("cors");
const methodOverride = require("method-override");
// const db = mongoose.connection;
// const mongoURI = process.env.MONGOURI;

const PORT = process.env.PORT || 5000;

// letting user ID available to the templates

// app.use(function (req, res, next) {
//     res.locals.currentUser = req.session.userId;
//     next();
//   });

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));



app.use("/accounts", accountRoutes);
app.use("/jobs", jobRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
