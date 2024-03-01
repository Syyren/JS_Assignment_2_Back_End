const mongoose = require('mongoose');

//creating the Schema for my contacts to store in the database
const contactSchema = new mongoose.Schema({
  contactID: {
    type: Number,
    unique: true,
    required: true
  },
  fName: {
    type: String,
    required: true
  },
  lName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  categoryID: {
    type: String,
    required: true
  },
  organization: String,
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contact', contactSchema);