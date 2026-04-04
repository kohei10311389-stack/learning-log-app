import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <a href="/" className="logo">📖 学習ログ</a>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/:id/edit" element={<PostForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
