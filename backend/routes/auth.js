let videos = [
  { id: 1, title: 'Funny Cats', url: 'https://youtube.com/cat123', categoryId: 1 }
];

let nextVideoId = 2;


// backend/routes/auth.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const router = express.Router();

// Login endpoint
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Username and password are required' 
        });
    }
    
    // Check user credentials in database
    const query = 'SELECT id, name, email, password FROM users WHERE email = ?';
    
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Database error' 
            });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        const dbUser = results[0];
        
        // In production, use bcrypt to compare hashed passwords
        if (dbUser.password !== password) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        // Generate session ID
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Store session in database
        const sessionQuery = 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)';
        
        db.query(sessionQuery, [sessionId, dbUser.id, expiresAt], (err) => {
            if (err) {
                console.error('Session creation error:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Failed to create session' 
                });
            }
            
            res.json({ 
                success: true,
                session_id: sessionId,
                user: {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email
                }
            });
        });
    });
});

// Logout endpoint
router.post('/auth/logout', (req, res) => {
    const { session_id } = req.body;
    
    if (!session_id) {
        return res.status(400).json({ 
            success: false,
            message: 'Session ID is required' 
        });
    }
    
    // Remove session from database
    const query = 'DELETE FROM sessions WHERE id = ?';
    
    db.query(query, [session_id], (err, result) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Logout failed' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Successfully logged out' 
        });
    });
});

// Middleware to validate session
function validateSession(req, res, next) {
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
        return res.status(401).json({ 
            success: false,
            message: 'Session ID required' 
        });
    }
    
    // Check if session exists and is not expired
    const query = 'SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW()';
    
    db.query(query, [sessionId], (err, results) => {
        if (err) {
            console.error('Session validation error:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Session validation failed' 
            });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or expired session' 
            });
        }
        
        req.userId = results[0].user_id;
        req.sessionId = sessionId;
        next();
    });
}

// Get all videos
router.get('/videos/:session_id', (req, res) => {
  const result = videos.map(v => {
    const category = categories.find(c => c.id === v.categoryId);
    return {
      ...v,
      categoryName: category ? category.name : 'Unknown'
    };
  });
  res.json(result);
});

// Create video
router.post('/video', (req, res) => {
  const { session_id, title, url, categoryId } = req.body;

  if (!session_id || !title || !url || !categoryId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const newVideo = {
    id: nextVideoId++,
    title,
    url,
    categoryId: parseInt(categoryId)
  };

  videos.push(newVideo);
  res.json({ success: true, video: newVideo });
});

// Delete video
router.delete('/video/:session_id/:id', (req, res) => {
  const id = parseInt(req.params.id);
  videos = videos.filter(v => v.id !== id);
  res.json({ success: true });
});


module.exports = router;
module.exports.validateSession = validateSession;