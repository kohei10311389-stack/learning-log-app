import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getPosts } from '../api/client'
import PostCard from '../components/PostCard'
import StatsCards from '../components/StatsCards'
import { SkeletonGrid } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import { listVariants } from '../utils/animations'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    getPosts()
      .then(res => setPosts(res.data))
      .catch(() => setError('投稿の取得に失敗しました'))
      .finally(() => setLoading(false))
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

      {!loading && <StatsCards posts={posts} />}

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

      <AnimatePresence mode="wait">
        {loading ? (
          <SkeletonGrid key="skeleton" count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState key="empty" />
        ) : (
          <motion.div
            key="grid"
            className="post-grid"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/posts/${post.id}`)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
