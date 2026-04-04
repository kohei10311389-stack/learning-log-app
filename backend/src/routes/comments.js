const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db/database');
const { validateComment } = require('../middleware/validate');

// GET /api/posts/:postId/comments
router.get('/', (req, res) => {
  try {
    const comments = db.prepare(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
    ).all(req.params.postId);
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// POST /api/posts/:postId/comments
router.post('/', validateComment, (req, res) => {
  try {
    const post = db.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).get(req.params.postId);
    if (!post) return res.status(404).json({ error: '投稿が見つかりません' });

    const { content, type } = req.body;
    const result = db.prepare(
      'INSERT INTO comments (post_id, content, type) VALUES (?, ?, ?)'
    ).run(req.params.postId, content.trim(), type);

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
