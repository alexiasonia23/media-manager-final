const express = require('express');
const router = express.Router();
const { validateSession } = require('./auth');
const db = require('../config/database');

// Get all videos
router.get('/videos', validateSession, (req, res) => {
    const query = `
        SELECT v.*, c.name as category_name 
        FROM videos v 
        LEFT JOIN categories c ON v.category_id = c.id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching videos:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to fetch videos' 
            });
        }
        res.json(results);
    });
});

// Create video
router.post('/videos', validateSession, (req, res) => {
    const { title, url, category_id } = req.body;
    
    if (!title || !url || !category_id) {
        return res.status(400).json({ 
            success: false,
            message: 'Title, URL, and category are required' 
        });
    }
    
    const query = 'INSERT INTO videos (title, url, category_id) VALUES (?, ?, ?)';
    
    db.query(query, [title, url, category_id], (err, result) => {
        if (err) {
            console.error('Error creating video:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to create video' 
            });
        }
        
        res.status(201).json({
            success: true,
            video: {
                id: result.insertId,
                title,
                url,
                category_id
            }
        });
    });
});

// Update video
router.put('/videos/:id', validateSession, (req, res) => {
    const { id } = req.params;
    const { title, url, category_id } = req.body;
    
    if (!title || !url || !category_id) {
        return res.status(400).json({ 
            success: false,
            message: 'Title, URL, and category are required' 
        });
    }
    
    const query = 'UPDATE videos SET title = ?, url = ?, category_id = ? WHERE id = ?';
    
    db.query(query, [title, url, category_id, id], (err, result) => {
        if (err) {
            console.error('Error updating video:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to update video' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Video not found' 
            });
        }
        
        res.json({
            success: true,
            video: {
                id,
                title,
                url,
                category_id
            }
        });
    });
});

// Delete video
router.delete('/videos/:id', validateSession, (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM videos WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting video:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to delete video' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Video not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Video deleted successfully' 
        });
    });
});

module.exports = router;