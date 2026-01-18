require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/Book');

const app = express();
app.use(express.json());
app.use(cors());


app.get('/api/books', async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};
    
    
    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/books', async (req, res) => {
  try {
    
    const { title, author, isbn, totalCopies } = req.body;
    const book = new Book({
      title, author, isbn, 
      totalCopies, 
      availableCopies: totalCopies 
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.post('/api/books/:id/borrow', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });


    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: "Book currently unavailable" });
    }


    book.availableCopies -= 1;
    await book.save();

    res.json({ message: "Book borrowed successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/books/:id/return', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.availableCopies >= book.totalCopies) {
      return res.status(400).json({ error: "All copies are already returned" });
    }


    book.availableCopies += 1;
    await book.save();

    res.json({ message: "Book returned successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));