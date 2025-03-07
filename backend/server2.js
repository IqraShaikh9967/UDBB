// const http = require("http");
// const url = require("url");
// const fs = require("fs");
// const jwt = require("jsonwebtoken"); // Import JWT for token authentication

// const PORT = 3000;
// const SECRET_KEY = "your_secret_key"; // Secret key for signing tokens

// // Dummy user data
// const users = {
//     "volunteer@example.com": { password: "password123", role: "volunteer" },
//     "admin@example.com": { password: "adminpass", role: "admin" }
// };

// // Function to authenticate users
// function authenticateUser(email, password) {
//     const user = users[email];
//     if (user && user.password === password) {
//         return { email, role: user.role };
//     }
//     return null;
// }

// // Middleware to verify JWT token
// function verifyToken(req, callback) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return callback(null); // No token or invalid format
//     }
//     const token = authHeader.split(" ")[1]; // Extract token
//     jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if (err) return callback(null); // Invalid token
//         callback(decoded); // Valid token, return decoded user data
//     });
// }

// // Create server
// if (req.method === "POST" && parsedUrl.pathname === "/login") {
//     let body = "";
//     req.on("data", chunk => { body += chunk.toString(); });
//     req.on("end", () => {
//         try {
//             const { email, password } = JSON.parse(body);
//             if (!email || !password) {
//                 res.writeHead(400, { "Content-Type": "application/json" });
//                 return res.end(JSON.stringify({ message: "Email and password are required" }));
//             }
//             const user = authenticateUser(email, password);
//             if (user) {
//                 const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
//                 res.writeHead(200, { "Content-Type": "application/json" });
//                 res.end(JSON.stringify({ message: "Login successful", token }));
//             } else {
//                 res.writeHead(401, { "Content-Type": "application/json" });
//                 res.end(JSON.stringify({ message: "Invalid credentials" }));
//             }
//         } catch (error) {
//             res.writeHead(400, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ message: "Invalid request body" }));
//         }
//     });
// }
//     // Protected route for adding records
//     else if (req.method === "POST" && parsedUrl.pathname === "/add-record") {
//         verifyToken(req, user => {
//             if (!user || user.role !== "volunteer") {
//                 res.writeHead(403, { "Content-Type": "application/json" });
//                 return res.end(JSON.stringify({ message: "Forbidden: Only volunteers can add records" }));
//             }
//             let body = "";
//             req.on("data", chunk => { body += chunk.toString(); });
//             req.on("end", () => {
//                 try {
//                     const record = JSON.parse(body);
//                     // Save the record to the database or file
//                     console.log("New Record:", record);
//                     res.writeHead(200, { "Content-Type": "application/json" });
//                     res.end(JSON.stringify({ message: "Record added successfully!" }));
//                 } catch (error) {
//                     res.writeHead(500, { "Content-Type": "application/json" });
//                     res.end(JSON.stringify({ message: "Invalid server error" }));
//                 }
//             });
//         });
//     }
//     else if (req.method === "GET" && parsedUrl.pathname === "/check-role") {
//         verifyToken(req, user => {
//             if (!user) {
//                 res.writeHead(401, { "Content-Type": "application/json" });
//                 return res.end(JSON.stringify({ message: "Unauthorized" }));
//             }
//             res.writeHead(200, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ role: user.role }));
//         });
//     }
//     // Default 404 route
//     else {
//         res.writeHead(404, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "Route not found" }));
//     }


// // Start server
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// res.setHeader("Access-Control-Allow-Origin", "*");
// res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
// res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");



// newwwww



const http = require("http");
const url = require("url");
const fs = require("fs");
const jwt = require("jsonwebtoken"); // Import JWT for authentication

const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Secret key for signing tokens

// Dummy user data
const users = {
    "volunteer@example.com": { password: "password123", role: "volunteer" },
    "admin@example.com": { password: "adminpass", role: "admin" }
};

// Function to authenticate users
function authenticateUser(email, password) {
    const user = users[email];
    if (user && user.password === password) {
        return { email, role: user.role };
    }
    return null;
}

// Middleware to verify JWT token
function verifyToken(req, callback) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return callback(null); // No token or invalid format
    }
    const token = authHeader.split(" ")[1]; // Extract token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return callback(null); // Invalid token
        callback(decoded); // Valid token, return decoded user data
    });
}

// Creating the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Set CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    // Login Route
    if (req.method === "POST" && parsedUrl.pathname === "/login") {
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", () => {
            try {
                const { email, password } = JSON.parse(body);
                if (!email || !password) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Email and password are required" }));
                }
                const user = authenticateUser(email, password);
                if (user) {
                    const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Login successful", token }));
                } else {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid credentials" }));
                }
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid request body" }));
            }
        });
    }
    // Protected route for adding records
    else if (req.method === "POST" && parsedUrl.pathname === "/add-record") {
        verifyToken(req, user => {
            if (!user || user.role !== "volunteer") {
                res.writeHead(403, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Forbidden: Only volunteers can add records" }));
            }
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
                try {
                    const record = JSON.parse(body);
                    console.log("New Record:", record);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Record added successfully!" }));
                } catch (error) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid server error" }));
                }
            });
        });
    }
    // Check role route
    else if (req.method === "GET" && parsedUrl.pathname === "/check-role") {
        verifyToken(req, user => {
            if (!user) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Unauthorized" }));
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ role: user.role }));
        });
    }
    // Default 404 route
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
