import { useState } from 'react'
import { createComment } from '../api/client'

export default function CommentForm({ postId, onAdded }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState('self')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await createComment(postId, { content, type })
      onAdded(res.data)
      setContent('')
    } catch (err) {
      setError(err.response?.data?.error || 'コメントの投稿に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>コメントを追加</h3>
      {error && <p className="error">{error}</p>}
      <div className="comment-form-row">
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="self">自分メモ</option>
          <option value="instructor">講師</option>
          <option value="manager">上長</option>
        </select>
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="コメントや気づきを入力..."
        rows={4}
        required
      />
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? '送信中...' : 'コメントする'}
      </button>
    </form>
  )
}
