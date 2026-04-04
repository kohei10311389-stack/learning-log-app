import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost, createPost, updatePost } from '../api/client'

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getPost(id)
        .then(res => {
          setTitle(res.data.title)
          setContent(res.data.content)
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
        await updatePost(id, { title, content })
        navigate(`/posts/${id}`)
      } else {
        const res = await createPost({ title, content })
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
