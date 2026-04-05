import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/',           icon: '⊞', label: 'ホーム' },
  { path: '/categories', icon: '☰', label: 'カテゴリ' },
  { path: '/posts/new',  icon: '＋', label: '投稿', accent: true },
  { path: '/search',     icon: '○', label: '検索' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path
        return (
          <button
            key={item.path}
            className={`bottom-nav-item ${active ? 'active' : ''} ${item.accent ? 'accent' : ''}`}
            onClick={() => navigate(item.path)}
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
