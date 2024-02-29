const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://database1:databaseuserpass@cluster0.yurnnop.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for successful connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/contacts', require('./routes/ContactRoutes'));
app.use('/categories', require('./routes/CategoryRoutes'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});