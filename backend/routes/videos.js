const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all videos with category names
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT videos.id, videos.title, videos.url, videos.category_id, categories.name AS categoryName
      FROM videos
      LEFT JOIN categories ON videos.category_id = categories.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

// Add new video
router.post('/', async (req, res) => {
  const { title, url, categoryId } = req.body;

  if (!title || !url || !categoryId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO videos (title, url, category_id) VALUES (?, ?, ?)',
      [title, url, categoryId]
    );
    res.json({ success: true, videoId: result.insertId });
  } catch (err) {
    console.error('Error adding video:', err);
    res.status(500).json({ message: 'Error adding video' });
  }
});

// Delete video
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM videos WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ message: 'Error deleting video' });
  }
});

module.exports = router;
