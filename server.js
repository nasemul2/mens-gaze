// =================================================================
// == Main Server File for Men's Gaze E-commerce Site          ==
// =================================================================

// Core Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Feature Dependencies
const session = require('express-session');
const cors = require('cors');

// =================================================================
// == App Configuration                                         ==
// =================================================================

const app = express();
const PORT = 8000;

// --- Secrets & Configuration ---
// IMPORTANT: In a real production environment, use process.env for these!
const ADMIN_PASSWORD = 'P@ndU';
const ADMIN_SECRET_CODE = 'gaze_admin';
const SESSION_SECRET = 'c9f9e2a9a3b3a3e3a3e3a3e3a3e3a3e3a3e3a3e3a3e3a3e3a3e3a3e3a3e3a3e3';

// --- Middleware Setup ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies, increased limit for product data
app.use(express.static(path.join(__dirname, 'mens-gaze'))); // Serve static files
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// =================================================================
// == Security Middleware                                       ==
// =================================================================

const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next(); // User is authenticated, proceed
    } else {
        res.redirect('/admin-login.html'); // User is not authenticated, redirect to login
    }
};

// =================================================================
// == API Routes                                                ==
// =================================================================

// --- Auth Routes ---
app.post('/api/login', (req, res) => {
    const { password, secretCode } = req.body;
    if (password === ADMIN_PASSWORD && secretCode === ADMIN_SECRET_CODE) {
        req.session.isAuthenticated = true;
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logged out');
});

// --- Product Management Route ---
app.post('/api/update-products', requireAuth, (req, res) => {
    const products = req.body;
    const filePath = path.join(__dirname, 'mens-gaze', 'products.json');
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('!!! ERROR SAVING PRODUCTS !!!', err);
            return res.status(500).send('Error saving products');
        }
        res.status(200).send('Products saved successfully');
    });
});

// =================================================================
// == Page Serving Routes                                       ==
// =================================================================

// Serve the main pages (these don't require auth)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'mens-gaze', 'index.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'mens-gaze', 'products.html')));
app.get('/admin-login', (req, res) => res.sendFile(path.join(__dirname, 'mens-gaze', 'admin-login.html')));

// The admin page is protected by the requireAuth middleware
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'mens-gaze', 'admin.html'));
});

// =================================================================
// == Start Server                                              ==
// =================================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running and accessible on your network at http://<your-ip-address>:${PORT}`);
});
