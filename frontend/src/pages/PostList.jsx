import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPosts } from '../api/client'
import PostCard from '../components/PostCard'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    getPosts()
      .then(res => setPosts(res.data))
      .catch(() => setError('投稿の取得に失敗しました'))
  }, [])

  const filtered = posts.filter(p => {
    const matchQuery = p.title.includes(query) || p.content.includes(query)
    const matchCategory = activeCategory ? p.category === activeCategory : true
    return matchQuery && matchCategory
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">学習ログ</h1>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="投稿を検索..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {activeCategory && (
        <div className="filter-bar">
          <span className="filter-badge">{activeCategory}</span>
          <button className="filter-clear" onClick={() => setSearchParams({})}>✕</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {filtered.length === 0 ? (
        <p className="empty">まだ投稿がありません。最初の学習ログを記録しましょう！</p>
      ) : (
        <div className="post-grid">
          {filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/posts/${post.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
