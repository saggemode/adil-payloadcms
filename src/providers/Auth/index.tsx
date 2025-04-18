'use client'

import { User } from '@/payload-types'
import React, { createContext, useContext } from 'react'
import { 
  useAuth as useAuthQuery, 
  useLogin as useLoginMutation,
  useLogout as useLogoutMutation,
  useCreateUser as useCreateMutation,
  useResetPassword as useResetMutation,
  useForgotPassword as useForgotMutation
} from '@/hooks/use-auth'
import { useQueryClient } from '@tanstack/react-query'

// Define the shape of the auth context
type AuthContext = {
  user: User | null | undefined
  isLoading: boolean
  isSuccess: boolean
  status: 'loggedIn' | 'loggedOut' | undefined
  setUser: (user: User) => void
  login: (args: { email: string; password: string }) => Promise<User>
  logout: () => Promise<void>
  create: (args: { email: string; password: string; passwordConfirm: string }) => Promise<void>
  resetPassword: (args: { password: string; passwordConfirm: string; token: string }) => Promise<void>
  forgotPassword: (args: { email: string }) => Promise<void>
}

// Create the auth context
const Context = createContext({} as AuthContext)

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the main auth query hook
  const { 
    data: authData, 
    isLoading, 
    isSuccess 
  } = useAuthQuery()

  // Use mutation hooks
  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()
  const createMutation = useCreateMutation()
  const resetMutation = useResetMutation()
  const forgotMutation = useForgotMutation()
  const queryClient = useQueryClient()

  // Determine the current user and auth status
  const user = authData?.user
  const status = user ? 'loggedIn' : (isSuccess ? 'loggedOut' : undefined)

  // Login handler
  const login = async (args: { email: string; password: string }): Promise<User> => {
    const result = await loginMutation.mutateAsync(args)
    if (!result.success) {
      throw new Error(result.message || 'Login failed')
    }
    return result.user as User
  }

  // Logout handler
  const logout = async (): Promise<void> => {
    const result = await logoutMutation.mutateAsync()
    if (!result.success) {
      throw new Error(result.message || 'Logout failed')
    }
  }

  // Create user handler
  const create = async (args: { email: string; password: string; passwordConfirm: string }): Promise<void> => {
    const result = await createMutation.mutateAsync(args)
    if (!result.success) {
      throw new Error(result.message || 'User creation failed')
    }
  }

  // Reset password handler
  const resetPassword = async (args: { password: string; passwordConfirm: string; token: string }): Promise<void> => {
    const result = await resetMutation.mutateAsync(args)
    if (!result.success) {
      throw new Error(result.message || 'Password reset failed')
    }
  }

  // Forgot password handler
  const forgotPassword = async (args: { email: string }): Promise<void> => {
    const result = await forgotMutation.mutateAsync(args)
    if (!result.success) {
      throw new Error(result.message || 'Forgot password request failed')
    }
  }

  // Helper function to update user data in context
  const setUser = (updatedUser: User): void => {
    queryClient.setQueryData(['auth'], { 
      user: updatedUser,
      success: true 
    })
  }

  return (
    <Context.Provider
      value={{
        user,
        isLoading,
        isSuccess,
        status,
        setUser,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
      }}
    >
      {children}
    </Context.Provider>
  )
}

// Hook to use the auth context
export const useAuth = () => useContext(Context)
