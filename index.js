const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const { portfolioRoute } = require("./routes/routes");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);

// Mongoose configuration
// var underlyingDb;
mongoose.connect(process.env.MONGO_DB, (error, response) => {
  if (error) {
    console.log("Unable to connect to Mongoose Server " + error);
  } else {
    console.log("Connected to Mongoose Server " + response);
    // underlyingDb = response;
  }
});

//Mongodb Store
const store = new mongoDbStore(
  {
    uri: process.env.MONGO_DB,
    collection: 'passResetOtp'
  },
  //  ((error) => console.log(`Unable to start mongoDBStore ${error}`))
)

store.on('connected', (result) =>{
store.client;
  console.log(`Connected to mongodb store ${result}`)
})

store.on('error', (err) =>
  console.log(`Connected to mongodb store ${err}`))

var mySession = {
  name: 'localhost',
  secret: 'secretkey',
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 120000 },
  store: store,
}
// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session(mySession))
app.use(cors());


// General Endpoint
app.use("/portfolio", (req, _, next) => {
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



