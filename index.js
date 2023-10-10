const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const {portfolioRoute} = require("./routes/routes");
const cookieParser = require("cookie-parser")
const session = require("express-session")

// Mongoose configuration
mongoose.connect(process.env.MONGO_DB, (error, response) => {
  if (error) {
    console.log("Unable to connect to Mongoose Server " + error);
  } else {
    console.log("Connected to Mongoose Server " + response);
  }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(cookieParser())
app.use(
  session({
    name: 'myOtp', 
    secret: 'secretkey', 
    saveUninitialized: true, 
    resave: true, 
    cookie: { maxAge: 120000 } }))

// General Endpoint
app.use("/portfolio", (req, _, next)=>{
  console.log(req.session)
  return next()
}, portfolioRoute);

// Server Connection
app.listen(port, (err) => {   
  if (err) {
    console.log("Unable to connect to the express server at port 4000 ", err);
  } else {
    console.log("Connection to the express server on port 4000 established");
  }
});
  