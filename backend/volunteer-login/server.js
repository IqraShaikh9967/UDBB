// mine 

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

app.use(cors());
app.use(bodyParser.json());

// Load admin-provided credentials from a JSON file
const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));

// Volunteer login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password match
    const user = credentials.find((cred) => cred.username === username && cred.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a simple JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });

    res.json({ message: "Login successful", token });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
