import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost, deletePost, getComments } from '../api/client'
import { useAuth } from '../context/AuthContext'
import CommentForm from '../components/CommentForm'

const TYPE_LABEL = { instructor: '講師', manager: '上長', self: '自分メモ' }

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getPost(id)
      .then(res => setPost(res.data))
      .catch(() => setError('投稿の取得に失敗しました'))
    getComments(id)
      .then(res => setComments(res.data))
      .catch(() => {})
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('本当に削除しますか？')) return
    try {
      await deletePost(id)
      navigate('/')
    } catch {
      setError('削除に失敗しました')
    }
  }

  const formatDate = (str) =>
    new Date(str).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })

  if (error) return <p className="error">{error}</p>
  if (!post) return <p className="loading">読み込み中...</p>

  return (
    <div className="detail">
      <button onClick={() => navigate('/')} className="btn-back">← 一覧へ戻る</button>

      <h1>{post.title}</h1>
      <p className="date">
        投稿日: {formatDate(post.created_at)}
        {post.updated_at !== post.created_at && ` （更新: ${formatDate(post.updated_at)}）`}
      </p>

      <div className="content">{post.content}</div>

      {isAdmin && (
        <div className="actions">
          <button onClick={() => navigate(`/posts/${id}/edit`)} className="btn-secondary">
            編集
          </button>
          <button onClick={handleDelete} className="btn-danger">
            削除
          </button>
        </div>
      )}

      <section className="comments-section">
        <h2>フィードバック・メモ</h2>
        {comments.length === 0 ? (
          <p className="empty">まだコメントはありません。</p>
        ) : (
          <ul className="comment-list">
            {comments.map(c => (
              <li key={c.id} className={`comment comment-${c.type}`}>
                <span className="comment-badge">{TYPE_LABEL[c.type]}</span>
                <p>{c.content}</p>
                <small>{formatDate(c.created_at)}</small>
              </li>
            ))}
          </ul>
        )}
        {isAdmin && (
          <CommentForm postId={id} onAdded={c => setComments(prev => [...prev, c])} />
        )}
      </section>
    </div>
  )
}
