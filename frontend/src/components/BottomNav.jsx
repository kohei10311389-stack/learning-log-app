import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin, logout } = useAuth()

  const NAV_ITEMS = [
    { path: '/',           icon: '⊞', label: 'ホーム' },
    { path: '/categories', icon: '☰', label: 'カテゴリ' },
    ...(isAdmin ? [{ path: '/posts/new', icon: '＋', label: '投稿', accent: true }] : []),
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
          <button
            key={item.path || item.label}
            className={`bottom-nav-item ${active ? 'active' : ''} ${item.accent ? 'accent' : ''}`}
            onClick={() => item.action ? item.action() : navigate(item.path)}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            {!item.accent && <span className="bottom-nav-label">{item.label}</span>}
          </button>
        )
      })}
    </nav>
  )
}
