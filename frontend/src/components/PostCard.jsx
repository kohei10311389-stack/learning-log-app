import { useState } from 'react'

function formatDate(dateStr) {
  if (!dateStr) return '日時不明'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '日時不明'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}/${m}/${day} ${h}:${min}`
}

export default function PostCard({ post, onClick }) {
  const [bookmarked, setBookmarked] = useState(false)
  const preview = post.content.length > 60
    ? post.content.slice(0, 60) + '...'
    : post.content

  return (
    <div className="post-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="post-card-top">
        <span className="post-badge">NEW</span>
        <button
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={e => { e.stopPropagation(); setBookmarked(v => !v) }}
          aria-label="ブックマーク"
        >
          {bookmarked ? '♥' : '♡'}
        </button>
      </div>
      <div className="post-card-emoji">📖</div>
      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-card-preview">{preview}</p>
      <div className="post-card-footer">
        <span className="post-card-date">{formatDate(post.created_at)}</span>
        <button className="post-card-btn" onClick={onClick} aria-label="詳細を見る">›</button>
      </div>
    </div>
  )
}
