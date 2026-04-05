import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '../api/client'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getPosts().then(res => {
      const cats = [...new Set(res.data.map(p => p.category).filter(Boolean))]
      setCategories(cats)
    }).catch(() => {})
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">カテゴリ</h1>
      </div>

      {categories.length === 0 ? (
        <p className="empty">まだカテゴリがありません。投稿時にカテゴリを入力してください。</p>
      ) : (
        <div className="category-grid">
          {categories.map(cat => (
            <button
              key={cat}
              className="category-card"
              onClick={() => navigate(`/?category=${encodeURIComponent(cat)}`)}
            >
              <div className="category-icon">📂</div>
              <span className="category-label">{cat}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
