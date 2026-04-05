import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getPosts } from '../api/client'
import { listVariants, itemVariants } from '../utils/animations'

const PALETTES = [
  { bg: '#ecfdf5', text: '#047857' },
  { bg: '#eff6ff', text: '#1d4ed8' },
  { bg: '#fdf2f8', text: '#9d174d' },
  { bg: '#f5f3ff', text: '#6d28d9' },
  { bg: '#fff7ed', text: '#c2410c' },
  { bg: '#fefce8', text: '#a16207' },
  { bg: '#f0f9ff', text: '#0369a1' },
  { bg: '#fff1f2', text: '#be123c' },
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

      <AnimatePresence mode="wait">
        {categories.length === 0 ? (
          <motion.p
            key="empty"
            className="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            まだカテゴリがありません。投稿時にカテゴリを入力してください。
          </motion.p>
        ) : (
          <motion.div
            key="grid"
            className="category-grid"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {categories.map(cat => {
              const p = getPalette(cat)
              return (
                <motion.button
                  key={cat}
                  className="category-card"
                  style={{ background: p.bg }}
                  onClick={() => navigate(`/?category=${encodeURIComponent(cat)}`)}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                >
                  <div className="category-icon">📂</div>
                  <span className="category-label" style={{ color: p.text }}>{cat}</span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
