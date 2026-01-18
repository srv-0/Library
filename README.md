#  Library Management System API

A backend system designed to manage library book inventories and borrowing workflows. This project implements complex business logic for stock management, search optimization using database indexing, and robust error handling.

> **Current Status:** MVP Complete (Backend API + Admin Dashboard)

---

##  Key Features (Resume Highlights)
* **Inventory Management:** Complete CRUD APIs to manage book records and track stock levels.
* **Borrowing Workflow:** Implemented transactional logic to handle borrow/return actions with strict availability constraints (e.g., preventing borrows when stock is 0).
* **Optimized Search:** High-performance search endpoints allowing querying by Title or Author, utilizing **MongoDB Indexed Fields** for faster retrieval.
* **Data Integrity:** Validations ensure `availableCopies` never exceeds `totalCopies` or drops below zero.

---

##  Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Frontend:** Vanilla JS / HTML5 (Dashboard)

---

##  Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/library-api.git](https://github.com/your-username/library-api.git)
    cd library-api
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    * Create a `.env` file (optional) or use the default local MongoDB URI.
    * Default: `mongodb://127.0.0.1:27017/library`

4.  **Run the Server:**
    ```bash
    node server.js
    ```
    * Server runs on `http://localhost:5000`

5.  **Open Dashboard:**
    * Double-click `index.html` to open the UI in your browser.

---

## 📡 API Documentation

### 1. Books Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Fetch all books. |
| `GET` | `/api/books?q=harry` | **Search** books by title or author (Regex). |
| `POST` | `/api/books` | Add a new book to inventory. |

**Sample POST Body:**
```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "isbn": "978-0201616224",
  "totalCopies": 5
}
```
Method,Endpoint,Description
POST,/api/books/:id/borrow,Decrements available stock. Fails if stock is 0.
POST,/api/books/:id/return,Increments available stock. Fails if stock is full.

### 2. Database Schema (Optimization)
The Book model uses MongoDB indexes to speed up search queries.
```
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Indexed
  author: { type: String, required: true, index: true }, // Indexed
  totalCopies: { type: Number, required: true, min: 1 },
  availableCopies: { type: Number, required: true, min: 0 }
});
```
### 3. Error Handling
The API returns consistent JSON error responses for smoother client integration.

400 Bad Request: specific business constraint violations (e.g., "Book currently unavailable").

404 Not Found: Invalid Book IDs.

500 Server Error: Database connection issues.
