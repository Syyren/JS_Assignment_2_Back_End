const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//enabling cors for the route
app.use(cors());

//MongoDB connection
mongoose.connect('mongodb+srv://database1:databaseuserpass@cluster0.yurnnop.mongodb.net/');

//checking for successful connection
mongoose.connection.on('connected', () => 
{
  console.log('Connected to MongoDB');
});

//listener for connection errors with MongoDB
mongoose.connection.on('error', (err) => 
{
  console.error('MongoDB connection error:', err);
});
  
//listener for connection disconnection with MongoDB
mongoose.connection.on('disconnected', () => 
{
  console.log('MongoDB disconnected');
});  

//using the body parser to easily parse JSON
app.use(bodyParser.json());

//routes the application uses
app.use('/contacts', require('./routes/ContactRoutes'));
app.use('/categories', require('./routes/CategoryRoutes'));

//setting the port and checking it's running correctly
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => 
{
  console.log(`Server running on port ${PORT}`);
});