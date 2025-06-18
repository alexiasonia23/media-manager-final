const express = require('express');
const router = express.Router();
const { validateSession } = require('./auth');
const db = require('../config/database');

// Get all categories
router.get('/categories', validateSession, (req, res) => {
    const query = 'SELECT * FROM categories ORDER BY name';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to fetch categories' 
            });
        }
        res.json(results);
    });
});

// Create category
router.post('/categories', validateSession, (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ 
            success: false,
            message: 'Category name is required' 
        });
    }
    
    const query = 'INSERT INTO categories (name) VALUES (?)';
    
    db.query(query, [name], (err, result) => {
        if (err) {
            console.error('Error creating category:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to create category' 
            });
        }
        
        res.status(201).json({
            success: true,
            category: {
                id: result.insertId,
                name
            }
        });
    });
});

// Update category
router.put('/categories/:id', validateSession, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ 
            success: false,
            message: 'Category name is required' 
        });
    }
    
    const query = 'UPDATE categories SET name = ? WHERE id = ?';
    
    db.query(query, [name, id], (err, result) => {
        if (err) {
            console.error('Error updating category:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to update category' 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }
        
        res.json({
            success: true,
            category: {
                id,
                name
            }
        });
    });
});

// Delete category
router.delete('/categories/:id', validateSession, (req, res) => {
    const { id } = req.params;
    
    // First check if category is in use
    const checkQuery = 'SELECT COUNT(*) as count FROM videos WHERE category_id = ?';
    
    db.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.error('Error checking category usage:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to check category usage' 
            });
        }
        
        if (results[0].count > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Cannot delete category that is in use by videos' 
            });
        }
        
        const deleteQuery = 'DELETE FROM categories WHERE id = ?';
        
        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error('Error deleting category:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Failed to delete category' 
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Category not found' 
                });
            }
            
            res.json({ 
                success: true,
                message: 'Category deleted successfully' 
            });
        });
    });
});

module.exports = router; 