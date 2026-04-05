import { motion } from 'framer-motion'

export default function StatsCards({ posts }) {
  const total = posts.length
  const categories = new Set(posts.map(p => p.category).filter(Boolean)).size
  const now = new Date()
  const thisMonth = posts.filter(p => {
    const d = new Date(p.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const stats = [
    { label: '総投稿数',    value: total,      icon: '📚', bg: '#dcfce7', color: '#166534' },
    { label: 'カテゴリ数',  value: categories, icon: '🗂️',  bg: '#dbeafe', color: '#1e40af' },
    { label: '今月の投稿',  value: thisMonth,  icon: '📅', bg: '#f3e8ff', color: '#6b21a8' },
  ]

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="stat-card"
          style={{ background: s.bg }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.06 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="stat-icon">{s.icon}</span>
          <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
          <span className="stat-label" style={{ color: s.color }}>{s.label}</span>
        </motion.div>
      ))}
    </div>
  )
}
