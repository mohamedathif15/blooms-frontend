import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bl_user')) }
    catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('bl_token', data.token)
    localStorage.setItem('bl_user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (form) => {
    const { data } = await authAPI.register(form)
    localStorage.setItem('bl_token', data.token)
    localStorage.setItem('bl_user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bl_token')
    localStorage.removeItem('bl_user')
    setUser(null)
  }, [])

  return (
    <Ctx.Provider value={{
      user, login, register, logout,
      isAdmin: user?.role === 'ADMIN'
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)