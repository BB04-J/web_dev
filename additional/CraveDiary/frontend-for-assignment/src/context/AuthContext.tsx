import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
      const { token, user: dbUser } = response.data
      
      const loggedUser: User = {
        id: dbUser._id || dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
      }
      
      setUser(loggedUser)
      localStorage.setItem('user', JSON.stringify(loggedUser))
      localStorage.setItem('authToken', token)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      throw new Error(message)
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, { username, email, password })
      const { token, user: dbUser } = response.data
      
      const loggedUser: User = {
        id: dbUser._id || dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
      }
      
      setUser(loggedUser)
      localStorage.setItem('user', JSON.stringify(loggedUser))
      localStorage.setItem('authToken', token)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed'
      throw new Error(message)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
