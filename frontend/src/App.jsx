import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import CategoriesPage from './pages/CategoriesPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import './index.css'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ flex: 1, minWidth: 0 }}
      >
        <Routes location={location}>
          <Route path="/"               element={<PostList />} />
          <Route path="/categories"     element={<CategoriesPage />} />
          <Route path="/search"         element={<SearchPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/posts/new"      element={<PostForm />} />
          <Route path="/posts/:id"      element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Sidebar />
          <main className="main">
            <AnimatedRoutes />
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
