'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'

import { RecoverSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { useAuth } from '@/providers/Auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { PasswordStrengthIndicator } from './password-strength-indicator'

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  const form = useForm<z.infer<typeof RecoverSchema>>({
    resolver: zodResolver(RecoverSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset link')
    }
  }, [token])

  const onSubmit = (values: z.infer<typeof RecoverSchema>) => {
    setError('')
    setSuccess('')

    if (!token) {
      setError('Invalid or expired reset link')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
          {
            method: 'POST',
            body: JSON.stringify({ ...values, token }),
            headers: { 'Content-Type': 'application/json' },
          },
        )

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Error resetting password')
          return
        }

        setSuccess('Password reset successfully!')

        // Auto login after successful password reset
        await login({ email: data.user.email, password: values.password })
        const redirect = searchParams?.get('redirect')
        router.push(redirect || '/')
      } catch (error) {
        setError('There was a problem while resetting your password. Please try again later.')
      }
    })
  }

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter new password"
                        type={showPassword ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrengthIndicator password={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2.5"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button 
            disabled={isPending || !token} 
            type="submit" 
            className="w-full"
          >
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
