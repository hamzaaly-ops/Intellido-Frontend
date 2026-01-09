import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      const accessToken = response.data.access_token
      setToken(accessToken)
      localStorage.setItem('token', accessToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      }
    }
  }

  const signup = async (userData) => {
    try {
      await axios.post('http://localhost:8000/users/signup', userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Signup failed',
      }
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    token,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
