import { motion } from 'framer-motion'
import { listVariants, itemVariants } from '../utils/animations'

export default function StatsCards({ posts }) {
  const total = posts.length
  const categories = new Set(posts.map(p => p.category).filter(Boolean)).size
  const now = new Date()
  const thisMonth = posts.filter(p => {
    const d = new Date(p.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  // 最近7日間の投稿数
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = posts.filter(p => new Date(p.created_at) >= weekAgo).length

  return (
    <motion.div
      className="stats-grid"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {/* メインカード（2行スパン・大） */}
      <motion.div
        className="stat-card stat-card-main"
        style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}
        variants={itemVariants}
        whileTap={{ scale: 0.97 }}
      >
        <span className="stat-icon">📚</span>
        <div className="stat-main-value">
          <span className="stat-value" style={{ color: '#047857' }}>{total}</span>
          <span className="stat-unit" style={{ color: '#059669' }}>件</span>
        </div>
        <span className="stat-label" style={{ color: '#065f46' }}>総学習ログ</span>
      </motion.div>

      {/* サブカード1 */}
      <motion.div
        className="stat-card stat-card-sub"
        style={{ background: '#eff6ff' }}
        variants={itemVariants}
        whileTap={{ scale: 0.96 }}
      >
        <span className="stat-icon stat-icon-sm">🗂️</span>
        <div className="stat-main-value">
          <span className="stat-value stat-value-sm" style={{ color: '#1d4ed8' }}>{categories}</span>
          <span className="stat-unit" style={{ color: '#3b82f6' }}>分野</span>
        </div>
        <span className="stat-label" style={{ color: '#1e40af' }}>カテゴリ数</span>
      </motion.div>

      {/* サブカード2 */}
      <motion.div
        className="stat-card stat-card-sub"
        style={{ background: '#f5f3ff' }}
        variants={itemVariants}
        whileTap={{ scale: 0.96 }}
      >
        <span className="stat-icon stat-icon-sm">📅</span>
        <div className="stat-main-value">
          <span className="stat-value stat-value-sm" style={{ color: '#6d28d9' }}>{thisMonth}</span>
          <span className="stat-unit" style={{ color: '#8b5cf6' }}>件</span>
        </div>
        <span className="stat-label" style={{ color: '#5b21b6' }}>今月の投稿</span>
      </motion.div>
    </motion.div>
  )
}
