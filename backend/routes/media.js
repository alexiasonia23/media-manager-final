const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validateSession } = require('./auth');

// Get all videos
router.get('/', validateSession, async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT v.*, c.name as category_name 
            FROM videos v 
            LEFT JOIN categories c ON v.category_id = c.id
        `);
        res.json(results);
    } catch (err) {
        console.error('Error fetching videos:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch videos' 
        });
    }
});

// Create video
router.post('/', validateSession, async (req, res) => {
    const { title, url, category_id } = req.body;
    
    if (!title || !url || !category_id) {
        return res.status(400).json({ 
            success: false, 
            message: 'Title, URL, and category are required' 
        });
    }
    
    try {
        const [result] = await pool.query(
            'INSERT INTO videos (title, url, category_id) VALUES (?, ?, ?)',
            [title, url, category_id]
        );
        
        res.json({ 
            success: true, 
            video_id: result.insertId 
        });
    } catch (err) {
        console.error('Error creating video:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create video' 
        });
    }
});

// Delete video
router.delete('/:id', validateSession, async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await pool.query('DELETE FROM videos WHERE id = ?', [id]);
        
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
    } catch (err) {
        console.error('Error deleting video:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete video' 
        });
    }
});

module.exports = router; 