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

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any email/password
    const demoUser: LocalUser = {
      id: 'demo-user-id',
      email: email
    }
    
    setUser(demoUser)
    localStorage.setItem('nutrition-app-user', JSON.stringify(demoUser))
  }

  const signUp = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, create user immediately
    const demoUser: LocalUser = {
      id: 'demo-user-id',
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