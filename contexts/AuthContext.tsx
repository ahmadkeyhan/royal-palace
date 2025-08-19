"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Guest {
  id: string
  fullname: string
  phone: string
  isVerified: boolean
}

interface AuthContextType {
  guest: Guest | null
  isAuthenticated: boolean
  login: (guestData: Guest) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = guest !== null && guest.isVerified

  // Load guest data from localStorage on mount
  useEffect(() => {
    try {
      const storedGuest = localStorage.getItem("guest")
      if (storedGuest) {
        const guestData = JSON.parse(storedGuest)
        setGuest(guestData)
      }
    } catch (error) {
      console.error("Error loading guest data:", error)
      localStorage.removeItem("guest")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (guestData: Guest) => {
    setGuest(guestData)
    localStorage.setItem("guest", JSON.stringify(guestData))
  }

  const logout = () => {
    setGuest(null)
    localStorage.removeItem("guest")
  }

  const value: AuthContextType = {
    guest,
    isAuthenticated,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
