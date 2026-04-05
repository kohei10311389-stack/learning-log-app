import { useState } from 'react'
import { motion } from 'framer-motion'
import { itemVariants } from '../utils/animations'

const PALETTES = [
  { bg: '#dcfce7', text: '#166534' },
  { bg: '#dbeafe', text: '#1e40af' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#f3e8ff', text: '#6b21a8' },
  { bg: '#ffedd5', text: '#9a3412' },
  { bg: '#fef9c3', text: '#854d0e' },
  { bg: '#e0f2fe', text: '#0c4a6e' },
  { bg: '#fef2f2', text: '#991b1b' },
]

function getCategoryPalette(category) {
  if (!category) return PALETTES[0]
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTES[Math.abs(hash) % PALETTES.length]
}

function getProgress(content) {
  return Math.min(100, Math.round((content.length / 500) * 100))
}

function formatDate(dateStr) {
  if (!dateStr) return '日時不明'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '日時不明'
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function PostCard({ post, onClick }) {
  const [bookmarked, setBookmarked] = useState(false)
  const preview = post.content.length > 60
    ? post.content.slice(0, 60) + '...'
    : post.content
  const palette = getCategoryPalette(post.category)
  const progress = getProgress(post.content)

  return (
    <motion.div
      className="post-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.currentTarget === e.target && e.key === 'Enter' && onClick()}
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: '0 10px 24px -4px rgb(0 0 0 / 0.09), 0 4px 8px -4px rgb(0 0 0 / 0.06)' }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
    >
      <div className="post-card-top">
        <span
          className="post-badge"
          style={{ background: palette.bg, color: palette.text }}
        >
          {post.category || 'その他'}
        </span>
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
      </div>
      <div className="post-progress-bar">
        <motion.div
          className="post-progress-fill"
          style={{ background: palette.text }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.15 }}
        />
      </div>
    </motion.div>
  )
}
