const mongoose = require('mongoose');

//creating the Schema for my categories to store in the database
const categorySchema = new mongoose.Schema({
  categoryID: {
    type: String,
    unique: true,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Category', categorySchema);