function validatePost(req, res, next) {
  const { title, content } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'タイトルは必須です' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '本文は必須です' });
  }
  next();
}

function validateComment(req, res, next) {
  const { content, type } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'コメントは必須です' });
  }
  const validTypes = ['instructor', 'manager', 'self'];
  if (!type || !validTypes.includes(type)) {
    return res.status(400).json({ error: 'typeはinstructor/manager/selfのいずれかです' });
  }
  next();
}

module.exports = { validatePost, validateComment };
