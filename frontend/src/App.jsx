import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import CategoriesPage from './pages/CategoriesPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import BottomNav from './components/BottomNav'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <main className="main">
            <Routes>
              <Route path="/"               element={<PostList />} />
              <Route path="/categories"     element={<CategoriesPage />} />
              <Route path="/search"         element={<SearchPage />} />
              <Route path="/login"          element={<LoginPage />} />
              <Route path="/posts/new"      element={<PostForm />} />
              <Route path="/posts/:id"      element={<PostDetail />} />
              <Route path="/posts/:id/edit" element={<PostForm />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
