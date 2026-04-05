import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost, createPost, updatePost, getPosts } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const isEdit = Boolean(id)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAdmin) navigate('/')
  }, [isAdmin, navigate])

  useEffect(() => {
    getPosts().then(res => {
      const cats = [...new Set(res.data.map(p => p.category).filter(Boolean))]
      setCategories(cats)
    }).catch(() => {})

    if (isEdit) {
      getPost(id)
        .then(res => {
          setTitle(res.data.title)
          setContent(res.data.content)
          setCategory(res.data.category || '')
        })
        .catch(() => setError('投稿の取得に失敗しました'))
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isEdit) {
        await updatePost(id, { title, content, category })
        navigate(`/posts/${id}`)
      } else {
        const res = await createPost({ title, content, category })
        navigate(`/posts/${res.data.id}`)
      }
    } catch (err) {
      setError(err.response?.data?.error || '保存に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <button
        onClick={() => navigate(isEdit ? `/posts/${id}` : '/')}
        className="btn-back"
      >
        ← 戻る
      </button>
      <h1>{isEdit ? '投稿を編集' : '新規学習ログ'}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="post-form">
        <label htmlFor="category">カテゴリ</label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="例：プログラミング、読書、英語..."
          list="category-suggestions"
        />
        <datalist id="category-suggestions">
          {categories.map(cat => (
            <option key={cat} value={cat} />
          ))}
        </datalist>

        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="例：Reactのuse效果を学んだ"
          required
        />
        <label htmlFor="content">本文</label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="今日学んだこと、気づき、疑問点などを記録..."
          rows={14}
          required
        />
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '保存中...' : isEdit ? '更新する' : '投稿する'}
        </button>
      </form>
    </div>
  )
}
