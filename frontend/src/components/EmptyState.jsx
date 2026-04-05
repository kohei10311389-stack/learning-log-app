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
      <div className="empty-state-icon">📚</div>
      <h2 className="empty-state-title">学習ログを始めよう</h2>
      <p className="empty-state-desc">
        今日学んだことを記録して、<br />成長を可視化しましょう。
      </p>
      {isAdmin && (
        <motion.button
          className="btn-primary empty-state-btn"
          onClick={() => navigate('/posts/new')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          最初の学習ログを記録する →
        </motion.button>
      )}
    </motion.div>
  )
}
