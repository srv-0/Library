const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true // 
  },
  author: {
    type: String,
    required: true,
    index: true // 
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  category: String,
  
  // 
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);