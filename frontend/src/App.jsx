import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import CategoriesPage from './pages/CategoriesPage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import BottomNav from './components/BottomNav'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="main">
          <Routes>
            <Route path="/"                  element={<PostList />} />
            <Route path="/categories"        element={<CategoriesPage />} />
            <Route path="/search"            element={<SearchPage />} />
            <Route path="/profile"           element={<ProfilePage />} />
            <Route path="/posts/new"         element={<PostForm />} />
            <Route path="/posts/:id"         element={<PostDetail />} />
            <Route path="/posts/:id/edit"    element={<PostForm />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
