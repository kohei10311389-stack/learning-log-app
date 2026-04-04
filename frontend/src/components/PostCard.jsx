export default function PostCard({ post, onClick }) {
  const preview = post.content.length > 120
    ? post.content.slice(0, 120) + '...'
    : post.content

  const date = new Date(post.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div className="post-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="post-card-header">
        <h2>{post.title}</h2>
        <span className="post-date">{date}</span>
      </div>
      <p className="post-preview">{preview}</p>
    </div>
  )
}
