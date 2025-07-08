'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Simple user interface for offline mode
interface LocalUser {
  id: string
  email: string
}

interface AuthContextType {
  user: LocalUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('nutrition-app-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Basic validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Validate email and password
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address')
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters long')
    }
    
    // Check if user exists in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('nutrition-app-users') || '[]')
    const existingUser = storedUsers.find((u: any) => u.email === email && u.password === password)
    
    if (!existingUser) {
      throw new Error('Invalid email or password')
    }
    
    const demoUser: LocalUser = {
      id: existingUser.id,
      email: email
    }
    
    setUser(demoUser)
    localStorage.setItem('nutrition-app-user', JSON.stringify(demoUser))
  }

  const signUp = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Validate email and password
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address')
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters long')
    }
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('nutrition-app-users') || '[]')
    const existingUser = storedUsers.find((u: any) => u.email === email)
    
    if (existingUser) {
      throw new Error('An account with this email already exists')
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: email,
      password: password
    }
    
    storedUsers.push(newUser)
    localStorage.setItem('nutrition-app-users', JSON.stringify(storedUsers))
    
    const demoUser: LocalUser = {
      id: newUser.id,
      email: email
    }
    
    setUser(demoUser)
    localStorage.setItem('nutrition-app-user', JSON.stringify(demoUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('nutrition-app-user')
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 