import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '../api/client'
import { useEffect } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getPosts().then(res => setPosts(res.data)).catch(() => {})
  }, [])

  const filtered = posts.filter(p =>
    p.title.includes(query) || p.content.includes(query)
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">検索</h1>
      </div>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="投稿を検索..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <div className="search-results">
        {query && filtered.length === 0 && (
          <p className="empty">「{query}」の検索結果はありません</p>
        )}
        {filtered.map(post => (
          <button key={post.id} className="search-result-item" onClick={() => navigate(`/posts/${post.id}`)}>
            <div className="search-result-title">{post.title}</div>
            <div className="search-result-date">{formatDate(post.created_at)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
