import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/',           icon: '⊞', label: 'ホーム' },
  { path: '/categories', icon: '☰', label: 'カテゴリ' },
  { path: '/posts/new',  icon: '＋', label: '新規投稿' },
  { path: '/search',     icon: '🔍', label: '検索' },
  { path: '/login',      icon: '🔑', label: 'ログイン' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">📖</span>
        <span className="sidebar-logo-text">学習ログ</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              className={`sidebar-item ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
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
