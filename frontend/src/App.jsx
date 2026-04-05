import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import CategoriesPage from './pages/CategoriesPage'
import SearchPage from './pages/SearchPage'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/"               element={<PostList />} />
            <Route path="/categories"     element={<CategoriesPage />} />
            <Route path="/search"         element={<SearchPage />} />
            <Route path="/posts/new"      element={<PostForm />} />
            <Route path="/posts/:id"      element={<PostDetail />} />
            <Route path="/posts/:id/edit" element={<PostForm />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
