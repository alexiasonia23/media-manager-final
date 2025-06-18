require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const videoRoutes = require('./routes/videos');

// Use routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', videoRoutes);

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`Admin panel at: http://localhost:${PORT}/admin`);
});

module.exports = app;