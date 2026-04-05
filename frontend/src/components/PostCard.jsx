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
  const preview = post.content.length > 120
    ? post.content.slice(0, 120) + '...'
    : post.content

  return (
    <div className="post-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="post-card-header">
        <h2>{post.title}</h2>
        <span className="post-date">{formatDate(post.created_at)}</span>
      </div>
      <p className="post-preview">{preview}</p>
    </div>
  )
}
