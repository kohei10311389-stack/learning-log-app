import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null)

  const isAdmin = Boolean(token)

  const login = useCallback(async (password) => {
    const res = await apiLogin(password)
    const { token: t } = res.data
    localStorage.setItem('admin_token', t)
    setToken(t)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
