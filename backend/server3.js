const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // JWT for authentication

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Change this for security

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable CORS
app.use(express.static('uploads')); // Serve static files from 'uploads'

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'burial_requests'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// Multer file upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Dummy user database for authentication
const users = {
    "volunteer@example.com": { password: "password123", role: "volunteer" },
    "admin@example.com": { password: "adminpass", role: "admin" }
};

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });
        req.user = decoded; // Store user data in request
        next();
    });
};

// ---------- NGO FORM ROUTES ---------- //

// Submit Burial Request
app.post('/submit-burial-form', upload.fields([
    { name: 'death_certificate_file', maxCount: 1 },
    { name: 'aadhar_card_file', maxCount: 1 }
]), (req, res) => {
    const { ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age, cause_of_death, body_details } = req.body;
    const death_certificate_file = req.files['death_certificate_file'] ? req.files['death_certificate_file'][0].path : '';
    const aadhar_card_file = req.files['aadhar_card_file'] ? req.files['aadhar_card_file'][0].path : '';

    const query = `INSERT INTO requests 
    (ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age, cause_of_death, body_details, death_certificate_file, aadhar_card_file) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age,
        cause_of_death, body_details, death_certificate_file, aadhar_card_file
    ], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error submitting request', error: err });
        res.status(200).json({ message: 'Request submitted successfully' });
    });
});

// Fetch Pending Requests
app.get('/pending-requests', (req, res) => {
    const query = 'SELECT * FROM requests WHERE status = "pending"';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching requests', error: err });
        res.status(200).json(results);
    });
});

// Approve or Deny Request
app.post('/approve-request', (req, res) => {
    const { id, status } = req.body;
    const query = 'UPDATE requests SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating status', error: err });
        res.status(200).json({ message: `Request ${status}` });
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

// ---------- VOLUNTEER LOGIN SYSTEM ---------- //

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const user = users[email];
    if (user && user.password === password) {
        const token = jwt.sign({ email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful", token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

// Add Record (Only for Volunteers)
app.post('/add-record', verifyToken, (req, res) => {
    if (req.user.role !== "volunteer") {
        return res.status(403).json({ message: "Forbidden: Only volunteers can add records" });
    }
    console.log("New Record:", req.body);
    res.status(200).json({ message: "Record added successfully!" });
});

// Check User Role
app.get('/check-role', verifyToken, (req, res) => {
    res.status(200).json({ role: req.user.role });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
