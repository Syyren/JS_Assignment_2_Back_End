const mongoose = require('mongoose');

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