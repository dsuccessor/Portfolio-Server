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
const clientDomain = process.env.NODE_ENV === 'development' ?
  ['http://localhost:3000', 'https://legacy.graphqlbin.com'] :
  'https://classic-portfolio.vercel.app'

const clientDomainSecurity = process.env.NODE_ENV === 'development' ? false : true

// Mongoose configuration
mongoose.connect(process.env.MONGO_DB, (error, response) => {
  if (error) {
    console.log("Unable to connect to Mongoose Server " + error);
  } else {
    console.log("Connected to Mongoose Server " + response);
  }
});

//Mongodb Store
const store = new mongoDbStore(
  {
    uri: process.env.MONGO_DB,
    collection: 'passResetOtp'
  },
)

// Store Initialization
store.on('connected', (result) => {
  store.client;
  console.log(`Connected to mongodb store`)
})
store.on('error', (err) => {
  console.log(`Connected to mongodb store ${err}`)
})


var mySession = {
  name: 'passReset',
  secret: 'secretkey',
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    maxAge: 120000,
  },
  store: store,
}

var corsOption = {
  origin: clientDomain,
  methods: ['POST', 'PUT', 'DELETE', 'GET', 'UPDATE', 'HEAD', 'PATCH', 'OPTIONS'],
  credentials: true,
  maxAge: 60000 * 2,
}


// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session(mySession))
app.use(cors(corsOption));


// General Endpoint
app.use("/portfolio", (req, res, next) => {
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



module.exports = store