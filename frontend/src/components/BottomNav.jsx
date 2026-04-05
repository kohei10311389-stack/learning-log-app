import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin, logout } = useAuth()

  const NAV_ITEMS = [
    { path: '/',           icon: '⊞', label: 'ホーム' },
    { path: '/categories', icon: '☰', label: 'カテゴリ' },
    { path: '/search',     icon: '○', label: '検索' },
    isAdmin
      ? { action: logout, icon: '🔓', label: 'ログアウト' }
      : { path: '/login',  icon: '🔑', label: 'ログイン' },
  ]

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => {
        const active = item.path && location.pathname === item.path
        return (
          <motion.button
            key={item.path || item.label}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => item.action ? item.action() : navigate(item.path)}
            aria-label={item.label}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
