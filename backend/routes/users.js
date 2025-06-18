// backend/routes/users.js
const express = require('express');
const db = require('../config/database');
const { validateSession } = require('./auth');
const router = express.Router();

// Get all users
router.get('/users/:session_id', validateSession, (req, res) => {
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY id';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(results);
    });
});

// Get specific user
router.get('/user/:session_id/:user_id', validateSession, (req, res) => {
    const userId = req.params.user_id;
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(results[0]);
    });
});

// Create new user
router.post('/user', validateSession, (req, res) => {
    const { name, email, passwd } = req.body;
    
    if (!name || !email || !passwd) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }
    
    // Check if email already exists
    const checkQuery = 'SELECT id FROM users WHERE email = ?';
    
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        // Insert new user (in production, hash the password with bcrypt)
        const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        
        db.query(insertQuery, [name, email, passwd, 'user'], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            
            res.status(201).json({ 
                message: 'User created successfully', 
                userId: result.insertId 
            });
        });
    });
});

// Update user
router.put('/user', validateSession, (req, res) => {
    const { user_id, name, email } = req.body;
    
    if (!user_id || !name || !email) {
        return res.status(400).json({ message: 'User ID, name and email are required' });
    }
    
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    
    db.query(query, [name, email, user_id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User updated successfully' });
    });
});

// Delete user
router.delete('/user/:session_id/:id', validateSession, (req, res) => {
    const userId = req.params.id;
    
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    
    // First delete user's sessions
    const deleteSessionsQuery = 'DELETE FROM sessions WHERE user_id = ?';
    
    db.query(deleteSessionsQuery, [userId], (err) => {
        if (err) {
            console.error('Error deleting user sessions:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        // Then delete the user
        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
        
        db.query(deleteUserQuery, [userId], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ message: 'User deleted successfully' });
        });
    });
});

module.exports = router;