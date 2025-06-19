
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /users - list all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// POST /users - create new user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// DELETE /users/:id - delete a user
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;