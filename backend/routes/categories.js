const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM categories');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Add new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name required' });

  try {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.json({ success: true, categoryId: result.insertId });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Error creating category' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router;
