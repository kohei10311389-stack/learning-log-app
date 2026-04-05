import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
  origin: (origin) => origin,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

// ===== Posts =====

// GET /api/posts
app.get('/api/posts', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC'
    ).all()
    return c.json(results)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// GET /api/posts/:id
app.get('/api/posts/:id', async (c) => {
  try {
    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).bind(c.req.param('id')).first()
    if (!post) return c.json({ error: '投稿が見つかりません' }, 404)
    return c.json(post)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// POST /api/posts
app.post('/api/posts', async (c) => {
  try {
    const { title, content } = await c.req.json()
    if (!title?.trim()) return c.json({ error: 'タイトルは必須です' }, 400)
    if (!content?.trim()) return c.json({ error: '本文は必須です' }, 400)

    const result = await c.env.DB.prepare(
      'INSERT INTO posts (title, content) VALUES (?, ?)'
    ).bind(title.trim(), content.trim()).run()

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(result.meta.last_row_id).first()
    return c.json(post, 201)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// PUT /api/posts/:id
app.put('/api/posts/:id', async (c) => {
  try {
    const { title, content } = await c.req.json()
    if (!title?.trim()) return c.json({ error: 'タイトルは必須です' }, 400)
    if (!content?.trim()) return c.json({ error: '本文は必須です' }, 400)

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).bind(c.req.param('id')).first()
    if (!post) return c.json({ error: '投稿が見つかりません' }, 404)

    await c.env.DB.prepare(
      'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title.trim(), content.trim(), c.req.param('id')).run()

    const updated = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(c.req.param('id')).first()
    return c.json(updated)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// DELETE /api/posts/:id
app.delete('/api/posts/:id', async (c) => {
  try {
    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).bind(c.req.param('id')).first()
    if (!post) return c.json({ error: '投稿が見つかりません' }, 404)

    await c.env.DB.prepare(
      'UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(c.req.param('id')).run()
    return c.json({ message: '削除しました' })
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// ===== Comments =====

// GET /api/posts/:postId/comments
app.get('/api/posts/:postId/comments', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
    ).bind(c.req.param('postId')).all()
    return c.json(results)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// POST /api/posts/:postId/comments
app.post('/api/posts/:postId/comments', async (c) => {
  try {
    const { content, type } = await c.req.json()
    if (!content?.trim()) return c.json({ error: 'コメントは必須です' }, 400)
    const validTypes = ['instructor', 'manager', 'self']
    if (!type || !validTypes.includes(type)) {
      return c.json({ error: 'typeはinstructor/manager/selfのいずれかです' }, 400)
    }

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).bind(c.req.param('postId')).first()
    if (!post) return c.json({ error: '投稿が見つかりません' }, 404)

    const result = await c.env.DB.prepare(
      'INSERT INTO comments (post_id, content, type) VALUES (?, ?, ?)'
    ).bind(c.req.param('postId'), content.trim(), type).run()

    const comment = await c.env.DB.prepare(
      'SELECT * FROM comments WHERE id = ?'
    ).bind(result.meta.last_row_id).first()
    return c.json(comment, 201)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

export default app
