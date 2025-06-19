let videos = [
  { id: 1, title: 'Funny Cats', url: 'https://youtube.com/cat123', categoryId: 1 }
];

let nextVideoId = 2;


// backend/routes/auth.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    console.log('BODY:',req.body);
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password }); // Debug log
    
    if (!username || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ 
            success: false,
            message: 'Username and password are required' 
        });
    }
    
    try {
        // Check user credentials in database
        const [results] = await pool.query(
            'SELECT id, name, email, password FROM users WHERE email = ?',
            [username]
        );
        
        console.log('Database results:', results); // Debug log
        
        if (results.length === 0) {
            console.log('No user found with email:', username);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        const dbUser = results[0];
        
        // In production, use bcrypt to compare hashed passwords
        if (dbUser.password !== password) {
            console.log('Password mismatch:', { 
                provided: password, 
                stored: dbUser.password 
            }); // Debug log
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        // Generate session ID
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Store session in database
        await pool.query(
            'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
            [sessionId, dbUser.id, expiresAt]
        );
        
        console.log('Login successful for user:', dbUser.email);
        
        res.json({ 
            success: true,
            session_id: sessionId,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    const { session_id } = req.body;
    
    if (!session_id) {
        return res.status(400).json({ 
            success: false,
            message: 'Session ID is required' 
        });
    }
    
    try {
        // Remove session from database
        await pool.query('DELETE FROM sessions WHERE id = ?', [session_id]);
        
        res.json({ 
            success: true,
            message: 'Successfully logged out' 
        });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Logout failed' 
        });
    }
});

// Middleware to validate session
async function validateSession(req, res, next) {
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
        return res.status(401).json({ 
            success: false,
            message: 'Session ID required' 
        });
    }
    
    try {
        // Check if session exists and is not expired
        const [results] = await pool.query(
            'SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW()',
            [sessionId]
        );
        
        if (results.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid or expired session' 
            });
        }
        
        req.userId = results[0].user_id;
        req.sessionId = sessionId;
        next();
    } catch (err) {
        console.error('Session validation error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Session validation failed' 
        });
    }
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