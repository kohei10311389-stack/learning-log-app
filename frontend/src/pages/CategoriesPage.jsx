import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { label: 'プログラミング', emoji: '💻' },
  { label: '読書',           emoji: '📚' },
  { label: '英語',           emoji: '🌏' },
  { label: '数学',           emoji: '📐' },
  { label: 'デザイン',       emoji: '🎨' },
  { label: 'ビジネス',       emoji: '📊' },
  { label: '資格・検定',     emoji: '📝' },
  { label: 'その他',         emoji: '✨' },
]

export default function CategoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">カテゴリ</h1>
      </div>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="カテゴリを検索..." readOnly />
      </div>
      <div className="category-grid">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            className="category-card"
            onClick={() => navigate('/')}
          >
            <div className="category-icon">{cat.emoji}</div>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
