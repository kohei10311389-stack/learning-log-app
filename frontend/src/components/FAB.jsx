import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function FAB() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()

  if (!isAdmin) return null
  // フォーム画面では非表示
  if (location.pathname === '/posts/new' || location.pathname.endsWith('/edit')) return null

  return (
    <motion.button
      className="fab"
      onClick={() => navigate('/posts/new')}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      aria-label="新規投稿"
    >
      ＋
    </motion.button>
  )
}
