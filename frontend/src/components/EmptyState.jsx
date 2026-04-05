import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemVariants } from '../utils/animations'

export default function EmptyState() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  return (
    <motion.div
      className="empty-state"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="empty-state-icon-wrap">
        <div className="empty-state-icon-bg" />
        <span className="empty-state-icon">📚</span>
      </div>

      <div className="empty-state-text">
        <h2 className="empty-state-title">学習の旅を始めよう</h2>
        <p className="empty-state-desc">
          小さな気づきも、明日の自分への贈り物。<br />
          今日学んだことを、ここに記録してみよう。
        </p>
      </div>

      {isAdmin && (
        <motion.button
          className="btn-primary empty-state-btn"
          onClick={() => navigate('/posts/new')}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(34,197,94,0.3)' }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          最初の学習ログを記録する →
        </motion.button>
      )}
    </motion.div>
  )
}
