'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  role: string
  telephone?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    const userData = Cookies.get('user')

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const { user: userData, token } = data

        Cookies.set('token', token, { expires: 7 })
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })

        setUser(userData)
        toast.success('Connexion réussie!')
        return data
      } else {
        throw new Error(data.message || 'Erreur de connexion')
      }
    } catch (error: any) {
      const message = error.message || 'Erreur de connexion'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        const { user: newUser, token } = data

        Cookies.set('token', token, { expires: 7 })
        Cookies.set('user', JSON.stringify(newUser), { expires: 7 })

        setUser(newUser)
        toast.success('Inscription réussie!')
        return data
      } else {
        throw new Error(data.message || 'Erreur d\'inscription')
      }
    } catch (error: any) {
      const message = error.message || 'Erreur d\'inscription'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    Cookies.remove('user')
    setUser(null)
    toast.success('Déconnexion réussie!')
    router.push('/auth')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 })
    }
  }

  return { user, loading, login, register, logout, updateUser }
}
