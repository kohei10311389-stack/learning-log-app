import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' }
})

client.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const login = (password) => client.post('/auth/login', { password })

export const getPosts   = ()           => client.get('/posts')
export const getPost    = (id)         => client.get(`/posts/${id}`)
export const createPost = (data)       => client.post('/posts', data)
export const updatePost = (id, data)   => client.put(`/posts/${id}`, data)
export const deletePost = (id)         => client.delete(`/posts/${id}`)

export const getComments   = (postId)       => client.get(`/posts/${postId}/comments`)
export const createComment = (postId, data) => client.post(`/posts/${postId}/comments`, data)
