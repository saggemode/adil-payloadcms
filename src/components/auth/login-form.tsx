'use client'

import * as React from 'react'
import * as z from 'zod'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { LoginSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { Button } from '../ui/button'

import { CardWrapper } from './card-wrapper'
import { useAuth } from '@/providers/Auth'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams?.toString() ? `?${searchParams?.toString()}` : ''
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null)

  const { login } = useAuth()
  const router = useRouter()
  const callbackUrl = searchParams?.get('callbackUrl')
  const urlError =
    searchParams?.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const checkLockout = () => {
    if (isLocked && lockoutTime) {
      const now = new Date()
      const diff = now.getTime() - lockoutTime.getTime()
      if (diff >= 5 * 60 * 1000) { // 5 minutes lockout
        setIsLocked(false)
        setLoginAttempts(0)
        setLockoutTime(null)
        return false
      }
      return true
    }
    return false
  }

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    if (checkLockout()) {
      setError('Account temporarily locked. Please try again later.')
      return
    }

    setError('')
    setSuccess('')

    startTransition(async () => {
      try {
        await login(values)
        setLoginAttempts(0)
        const redirect = searchParams?.get('redirect')
        router.push(redirect || '/')
      } catch (error) {
        setLoginAttempts(prev => prev + 1)
        if (loginAttempts >= 3) {
          setIsLocked(true)
          setLockoutTime(new Date())
          setError('Too many failed attempts. Account locked for 5 minutes.')
        } else {
          setError('Invalid email or password. Please try again.')
        }
      }
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending || isLocked}
                          placeholder="john.doe@example.com"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending || isLocked}
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex justify-between">
                        <Button size="sm" variant="link" asChild className="px-0 font-normal">
                          <Link href="/auth/recover-password">Forgot password?</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="link"
                          asChild
                          className="px-0 font-normal"
                        >
                          <Link href="/auth/reset-password">Reset password</Link>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button 
            disabled={isPending || isLocked} 
            type="submit" 
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : showTwoFactor ? (
              'Confirm'
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default LoginForm
