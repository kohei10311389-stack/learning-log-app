import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin, logout } = useAuth()

  const NAV_ITEMS = [
    { path: '/',           icon: '⊞', label: 'ホーム' },
    { path: '/categories', icon: '☰', label: 'カテゴリ' },
    ...(isAdmin ? [{ path: '/posts/new', icon: '＋', label: '新規投稿' }] : []),
    { path: '/search',     icon: '🔍', label: '検索' },
    isAdmin
      ? { action: logout, icon: '🔓', label: 'ログアウト' }
      : { path: '/login',  icon: '🔑', label: 'ログイン' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">📖</span>
        <span className="sidebar-logo-text">学習ログ</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const active = item.path && location.pathname === item.path
          return (
            <button
              key={item.path || item.label}
              className={`sidebar-item ${active ? 'active' : ''}`}
              onClick={() => item.action ? item.action() : navigate(item.path)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        学習ログ v1.0
      </div>
    </aside>
  )
}
