// Cursor and ChatGPT helped write this code
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import apiRoutes from './router';

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// initialize passport
app.use(passport.initialize());

// wire up API routes
app.use('/api', apiRoutes);

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    // connect DB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/financy_db';
    await mongoose.connect(mongoURI);
    console.log(`Mongoose connected to: ${mongoURI}`);

    const port = process.env.PORT || 9090;
    app.listen(port);

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
