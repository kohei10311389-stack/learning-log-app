import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-badge" />
      <div className="skeleton-emoji" />
      <div className="skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-progress" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <motion.div
      className="post-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </motion.div>
  )
}
