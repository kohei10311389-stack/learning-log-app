import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getPosts } from '../api/client'

const PALETTES = [
  { bg: '#dcfce7', text: '#166534' },
  { bg: '#dbeafe', text: '#1e40af' },
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#f3e8ff', text: '#6b21a8' },
  { bg: '#ffedd5', text: '#9a3412' },
  { bg: '#fef9c3', text: '#854d0e' },
  { bg: '#e0f2fe', text: '#0c4a6e' },
  { bg: '#fef2f2', text: '#991b1b' },
]

function getPalette(cat) {
  let hash = 0
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTES[Math.abs(hash) % PALETTES.length]
}

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

      <AnimatePresence>
        {categories.length === 0 ? (
          <p className="empty">まだカテゴリがありません。投稿時にカテゴリを入力してください。</p>
        ) : (
          <div className="category-grid">
            {categories.map((cat, i) => {
              const p = getPalette(cat)
              return (
                <motion.button
                  key={cat}
                  className="category-card"
                  style={{ background: p.bg, border: `1px solid ${p.text}22` }}
                  onClick={() => navigate(`/?category=${encodeURIComponent(cat)}`)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="category-icon">📂</div>
                  <span className="category-label" style={{ color: p.text }}>{cat}</span>
                </motion.button>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
