'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { LoginInput, RegisterInput } from '@/validations/auth'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = status === 'authenticated'
  const isLoadingAuth = status === 'loading'
  const user = session?.user

  /**
   * Inicia sesión con email y contraseña
   */
  const login = async (data: LoginInput) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        return { success: false, error: result.error }
      }

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
        return { success: true }
      }

      return { success: false, error: 'Error desconocido' }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Registra un nuevo usuario
   */
  const register = async (data: RegisterInput) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Error al registrar usuario')
        return { success: false, error: result.message }
      }

      // Auto-login después del registro
      const loginResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (loginResult?.ok) {
        router.push('/dashboard')
        router.refresh()
        return { success: true, user: result.user }
      }

      return { success: false, error: 'Error al iniciar sesión' }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al registrar usuario'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Inicia sesión con Google
   */
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Inicia sesión con GitHub
   */
  const loginWithGithub = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con GitHub')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cierra sesión
   */
  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut({ callbackUrl: '/login' })
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading: isLoadingAuth || isLoading,
    error,
    
    // Acciones
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    setError,
  }
}
