// const express = require('express');
// const mysql = require('mysql2');
// const session = require('express-session');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
// }));

// // MySQL connection setup
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Change to your MySQL username
//     password: 'admin123', // Change to your MySQL password
//     database: 'burial_requests' // Make sure your database name is correct
// });

// // Connect to MySQL
// db.connect((err) => {
//     if (err) throw err;
//     console.log('MySQL connected');
// });

// // Dummy user data for login
// const users = [
//     { username: 'admin', password: 'password123' },
//     { username: 'volunteer1', password: 'volunteer123' },
//     { username: 'user1', password: 'userpass' }
// ];

// // Login Route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(u => u.username === username && u.password === password);

//     if (user) {
//         req.session.user = user; // Store user in session
//         res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
//     } else {
//         res.status(401).json({ message: 'Invalid username or password' });
//     }
// });

// // Protected Route Middleware
// function isAuthenticated(req, res, next) {
//     if (req.session.user) {
//         return next();
//     }
//     res.status(401).json({ message: 'Unauthorized' });
// }

// // Dashboard Page (Protected)
// app.get('/dashboard', isAuthenticated, (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
// });

// // Logout Route
// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

// // File upload setup using Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Files will be uploaded into the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Give the uploaded file a unique name
//     }
// });
// const upload = multer({ storage: storage });

// // Route to handle form submissions
// app.post('/submit-burial-form', upload.fields([
//     { name: 'death_certificate_file', maxCount: 1 },
//     { name: 'aadhar_card_file', maxCount: 1 }
// ]), (req, res) => {
//     const { ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age, cause_of_death, body_details } = req.body;
//     const death_certificate_file = req.files['death_certificate_file'] ? req.files['death_certificate_file'][0].path : '';
//     const aadhar_card_file = req.files['aadhar_card_file'] ? req.files['aadhar_card_file'][0].path : '';

//     // SQL query to insert the data into the table
//     const query = `INSERT INTO requests 
//     (ngo_name, contact_number, email, contact_person, deceased_person, deceased_person_age, cause_of_death, body_details, death_certificate_file, aadhar_card_file) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     // Insert data into the database
//     db.query(query, [
//         ngo_name, 
//         contact_number, 
//         email, 
//         contact_person, 
//         deceased_person, 
//         deceased_person_age, 
//         cause_of_death, 
//         body_details, 
//         death_certificate_file, 
//         aadhar_card_file
//     ], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error submitting request', error: err });
//         }
//         res.status(200).json({ message: 'Request submitted successfully' });
//     });
// });

// // Route to fetch pending requests
// app.get('/pending-requests', isAuthenticated, (req, res) => {
//     const query = 'SELECT * FROM requests WHERE status = "pending"';
//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching requests', error: err });
//         }
//         res.status(200).json(results);
//     });
// });

// // Route to approve a request
// app.post('/approve-request', isAuthenticated, (req, res) => {
//     const { id, status } = req.body;
//     const query = 'UPDATE requests SET status = ? WHERE id = ?';
//     db.query(query, [status, id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error updating status', error: err });
//         }
//         res.status(200).json({ message: 'Request approved' });
//     });
// });

// // Route to deny a request
// app.post('/deny-request', isAuthenticated, (req, res) => {
//     const { id, status } = req.body;
//     const query = 'UPDATE requests SET status = ? WHERE id = ?';
//     db.query(query, [status, id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error updating status', error: err });
//         }
//         res.status(200).json({ message: 'Request denied' });
//     });
// });

// // Start the server on port 3000
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
   
// starts here 


// const express = require("express");
// const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const fs = require("fs");

// const app = express();
// const PORT = 5500;
// const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

// app.use(cors());
// app.use(bodyParser.json());

// // Load admin-provided credentials from a JSON file
// const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));

// // Volunteer login route
// app.post("/login", (req, res) => {
//     const { username, password } = req.body;

//     // Check if the username and password match
//     const user = credentials.find((cred) => cred.username === username && cred.password === password);

//     if (!user) {
//         return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Generate a simple JWT token
//     const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });

//     res.json({ message: "Login successful", token });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// ends here 

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
