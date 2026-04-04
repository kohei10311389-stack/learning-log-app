import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '../api/client'
import PostCard from '../components/PostCard'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getPosts()
      .then(res => setPosts(res.data))
      .catch(() => setError('投稿の取得に失敗しました'))
  }, [])

  return (
    <div>
      <div className="list-header">
        <h1>学習ログ一覧</h1>
        <button onClick={() => navigate('/posts/new')} className="btn-primary">
          ＋ 新規投稿
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 ? (
        <p className="empty">まだ投稿がありません。最初の学習ログを記録しましょう！</p>
      ) : (
        <div className="post-list">
          {posts.map(post => (
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
