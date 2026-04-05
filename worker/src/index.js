import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
  origin: (origin) => origin,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ===== JWT Utilities =====

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlDecode(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/')
  return atob(s + '='.repeat((4 - s.length % 4) % 4))
}

async function createJWT(secret) {
  const header  = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ admin: true, exp: Date.now() + 86400000 * 7 })))
  const data = `${header}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data)))
  return `${data}.${sig}`
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [header, payload, sig] = parts
    const data = `${header}.${payload}`
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const sigBytes = Uint8Array.from(b64urlDecode(sig), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
    if (!valid) return false
    const { admin, exp } = JSON.parse(b64urlDecode(payload))
    return admin === true && Date.now() < exp
  } catch {
    return false
  }
}

async function requireAuth(c) {
  const auth = c.req.header('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !(await verifyJWT(token, c.env.JWT_SECRET))) {
    return c.json({ error: '認証が必要です' }, 401)
  }
  return null
}

// ===== Auth =====

app.post('/api/auth/login', async (c) => {
  try {
    const { password } = await c.req.json()
    if (!password || password !== c.env.ADMIN_PASSWORD) {
      return c.json({ error: 'パスワードが正しくありません' }, 401)
    }
    const token = await createJWT(c.env.JWT_SECRET)
    return c.json({ token })
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// ===== Posts =====

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

app.post('/api/posts', async (c) => {
  const authErr = await requireAuth(c)
  if (authErr) return authErr
  try {
    const { title, content, category } = await c.req.json()
    if (!title?.trim()) return c.json({ error: 'タイトルは必須です' }, 400)
    if (!content?.trim()) return c.json({ error: '本文は必須です' }, 400)
    if (title.trim().length > 200) return c.json({ error: 'タイトルは200文字以内です' }, 400)
    if (content.trim().length > 50000) return c.json({ error: '本文は50000文字以内です' }, 400)

    const now = new Date().toISOString()
    const result = await c.env.DB.prepare(
      'INSERT INTO posts (title, content, category, created_at) VALUES (?, ?, ?, ?)'
    ).bind(title.trim(), content.trim(), category?.trim() || null, now).run()

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(result.meta.last_row_id).first()
    return c.json(post, 201)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

app.put('/api/posts/:id', async (c) => {
  const authErr = await requireAuth(c)
  if (authErr) return authErr
  try {
    const { title, content, category } = await c.req.json()
    if (!title?.trim()) return c.json({ error: 'タイトルは必須です' }, 400)
    if (!content?.trim()) return c.json({ error: '本文は必須です' }, 400)
    if (title.trim().length > 200) return c.json({ error: 'タイトルは200文字以内です' }, 400)
    if (content.trim().length > 50000) return c.json({ error: '本文は50000文字以内です' }, 400)

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).bind(c.req.param('id')).first()
    if (!post) return c.json({ error: '投稿が見つかりません' }, 404)

    await c.env.DB.prepare(
      'UPDATE posts SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title.trim(), content.trim(), category?.trim() || null, c.req.param('id')).run()

    const updated = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(c.req.param('id')).first()
    return c.json(updated)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

app.delete('/api/posts/:id', async (c) => {
  const authErr = await requireAuth(c)
  if (authErr) return authErr
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

app.post('/api/posts/:postId/comments', async (c) => {
  try {
    const auth = c.req.header('Authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    const isAdmin = token && (await verifyJWT(token, c.env.JWT_SECRET))

    const { content, type } = await c.req.json()
    if (!content?.trim()) return c.json({ error: 'コメントは必須です' }, 400)
    if (content.trim().length > 5000) return c.json({ error: 'コメントは5000文字以内です' }, 400)

    const adminTypes = ['instructor', 'manager', 'self']
    const validTypes = [...adminTypes, 'anonymous']
    const resolvedType = isAdmin ? (adminTypes.includes(type) ? type : 'self') : 'anonymous'
    if (!validTypes.includes(resolvedType)) {
      return c.json({ error: 'typeが不正です' }, 400)
    }

    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ? AND deleted_at IS NULL'
    ).bind(c.req.param('postId')).first()
    if (!post) return c.json({ error: '投稿が見つかりません' }, 404)

    const result = await c.env.DB.prepare(
      'INSERT INTO comments (post_id, content, type) VALUES (?, ?, ?)'
    ).bind(c.req.param('postId'), content.trim(), resolvedType).run()

    const comment = await c.env.DB.prepare(
      'SELECT * FROM comments WHERE id = ?'
    ).bind(result.meta.last_row_id).first()
    return c.json(comment, 201)
  } catch {
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

export default app
