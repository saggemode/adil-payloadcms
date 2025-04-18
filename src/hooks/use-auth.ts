import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '@/payload-types'

// Auth action interfaces
interface LoginArgs {
  email: string
  password: string
}

interface CreateUserArgs {
  email: string
  password: string
  passwordConfirm: string
}

interface ResetPasswordArgs {
  password: string
  passwordConfirm: string
  token: string
}

interface ForgotPasswordArgs {
  email: string
}

// Auth response interfaces
interface AuthResponse {
  success: boolean
  message?: string
  user?: User | null
}

// Authentication API functions
const fetchMe = async (): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      const { user } = await res.json()
      return { success: true, user: user || null }
    } else {
      return { success: false, message: 'Failed to fetch user', user: null }
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while fetching user', user: null }
  }
}

const loginUser = async (args: LoginArgs): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: args.email,
        password: args.password,
      }),
    })

    if (res.ok) {
      const { user, errors } = await res.json()
      if (errors) return { success: false, message: errors[0].message }
      return { success: true, user }
    }

    return { success: false, message: 'Invalid login' }
  } catch (error) {
    return { success: false, message: 'An error occurred while attempting to login.' }
  }
}

const logoutUser = async (): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      return { success: true, user: null }
    } else {
      return { success: false, message: 'An error occurred while attempting to logout.' }
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while attempting to logout.' }
  }
}

const createUser = async (args: CreateUserArgs): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: args.email,
        password: args.password,
        passwordConfirm: args.passwordConfirm,
      }),
    })

    if (res.ok) {
      const { data, errors } = await res.json()
      if (errors) return { success: false, message: errors[0].message }
      return { success: true, user: data?.loginUser?.user }
    } else {
      return { success: false, message: 'Invalid registration' }
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while attempting to register.' }
  }
}

const resetUserPassword = async (args: ResetPasswordArgs): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: args.password,
        passwordConfirm: args.passwordConfirm,
        token: args.token,
      }),
    })

    if (res.ok) {
      const { data, errors } = await res.json()
      if (errors) return { success: false, message: errors[0].message }
      return { success: true, user: data?.loginUser?.user }
    } else {
      return { success: false, message: 'Invalid password reset' }
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while attempting to reset password.' }
  }
}

const forgotUserPassword = async (args: ForgotPasswordArgs): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: args.email,
      }),
    })

    if (res.ok) {
      const { data, errors } = await res.json()
      if (errors) return { success: false, message: errors[0].message }
      return { success: true, user: data?.loginUser?.user }
    } else {
      return { success: false, message: 'Invalid email' }
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while attempting to process forgot password.' }
  }
}

// Main auth hook for user data
export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  })
}

// Login hook
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(['auth'], data)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Logout hook
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['auth'] })
      const previousAuth = queryClient.getQueryData(['auth'])
      
      // Optimistically update to logged out state
      queryClient.setQueryData(['auth'], { success: true, user: null })
      
      return { previousAuth }
    },
    onError: (err, variables, context) => {
      // If mutation fails, restore previous auth state
      if (context?.previousAuth) {
        queryClient.setQueryData(['auth'], context.previousAuth)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Create user hook
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(['auth'], data)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Reset password hook
export function useResetPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resetUserPassword,
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(['auth'], data)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotUserPassword,
  })
} 