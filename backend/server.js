const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.static('..')); // Serve static files (HTML, images, etc.) from the root project directory

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change to your MySQL username
    password: 'admin123',  // Change to your MySQL password
    database: 'burial_requests'  // Make sure your database name is correct
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// File upload setup using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be uploaded into the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Give the uploaded file a unique name
    }
});
const upload = multer({ storage: storage });

// Route to handle form submissions
app.post('/submit-burial-form', upload.fields([
    { name: 'death_certificate_file', maxCount: 1 },
    { name: 'aadhar_card_file', maxCount: 1 }
]), (req, res) => {
    const { ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age, cause_of_death, body_details } = req.body;
    const death_certificate_file = req.files['death_certificate_file'] ? req.files['death_certificate_file'][0].path : '';
    const aadhar_card_file = req.files['aadhar_card_file'] ? req.files['aadhar_card_file'][0].path : '';

    // SQL query to insert the data into the table
    const query = `INSERT INTO requests 
    (ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age, cause_of_death, body_details, death_certificate_file, aadhar_card_file) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Insert data into the database
    db.query(query, [
        ngo_name, 
        contact_number, 
        email, 
        contact_person, 
        deceased_person, 
        deceased_person_age, 
        cause_of_death, 
        body_details, 
        death_certificate_file, 
        aadhar_card_file
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error submitting request', error: err });
        }
        res.status(200).json({ message: 'Request submitted successfully' });
    });
});

// Route to fetch pending requests
app.get('/pending-requests', (req, res) => {
    const query = 'SELECT * FROM requests WHERE status = "pending"';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching requests', error: err });
        }
        res.status(200).json(results);
    });
});

// Route to approve a request
app.post('/approve-request', (req, res) => {
    const { id, status } = req.body;
    const query = 'UPDATE requests SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating status', error: err });
        }
        res.status(200).json({ message: 'Request approved' });
    });
});

// Route to deny a request
app.post('/deny-request', (req, res) => {
    const { id, status } = req.body;
    const query = 'UPDATE requests SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating status', error: err });
        }
        res.status(200).json({ message: 'Request denied' });
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
