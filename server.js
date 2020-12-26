require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
//routes
const categoryRouter = require('./routes/api/category');
const productRouter = require('./routes/api/product');
const uploadRouter = require('./routes/api/upload');
// const sellerRouter = require("./routes/api/seller");
const companyRouter = require('./routes/api/company');

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//cors middleware
app.use(cors());

//initialize passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
require('./config/authentication');

app.use(passport.initialize());
app.use(passport.session());

// Set up main routes

app.use(
  '/api/category',
  passport.authenticate('jwt', { session: false }),
  categoryRouter
);
app.use(
  '/api/product',
  passport.authenticate('jwt', { session: false }),
  productRouter
);
app.use('/api/upload', uploadRouter);
app.use('/api/company', companyRouter);

// Database uri
const dbURI = process.env.MONGO_URI;

// App's connection port
const PORT = process.env.PORT || 5000;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//test database connection
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected successfully...');
  // const company = db.collection("companies");
  // auth(app, company);
  app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
  });
});
