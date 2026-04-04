const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { validatePost } = require('../middleware/validate');

// GET /api/posts - 一覧（論理削除除外・新しい順）
router.get('/', (req, res) => {
  try {
    const posts = db.prepare(
      'SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC'
    ).all();
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// GET /api/posts/:id - 詳細
router.get('/:id', (req, res) => {
  try {
    const post = db.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).get(req.params.id);
    if (!post) return res.status(404).json({ error: '投稿が見つかりません' });
    res.json(post);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// POST /api/posts - 作成
router.post('/', validatePost, (req, res) => {
  try {
    const { title, content } = req.body;
    const result = db.prepare(
      'INSERT INTO posts (title, content) VALUES (?, ?)'
    ).run(title.trim(), content.trim());
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// PUT /api/posts/:id - 更新
router.put('/:id', validatePost, (req, res) => {
  try {
    const { title, content } = req.body;
    const post = db.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).get(req.params.id);
    if (!post) return res.status(404).json({ error: '投稿が見つかりません' });

    db.prepare(
      'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(title.trim(), content.trim(), req.params.id);

    const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// DELETE /api/posts/:id - 論理削除
router.delete('/:id', (req, res) => {
  try {
    const post = db.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).get(req.params.id);
    if (!post) return res.status(404).json({ error: '投稿が見つかりません' });

    db.prepare(
      'UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(req.params.id);

    res.json({ message: '削除しました' });
  } catch {
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
