'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

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

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof RecoverSchema>>({
    resolver: zodResolver(RecoverSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof RecoverSchema>) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
        {
          method: 'POST',
          body: JSON.stringify(values),
          headers: { 'Content-Type': 'application/json' },
        },
      )

      if (!response.ok) {
        setError(response.statusText || 'Error creating the account.')
        return
      }

      setSuccess('Password Reset successfully!')

      try {
        const json = await response.json()

        await login({ email: json.user.email, password: values.password })
        const redirect = searchParams.get('redirect')
        router.push(redirect || '/')
      } catch {
        setError('There was a problem while resetting your password. Please try again later.')
      }
    })
  }

  // useEffect(() => {
  //   reset({ token: token || undefined })
  // }, [reset, token])

  return (
    <CardWrapper
      headerLabel="Reset your password?"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Recover Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
