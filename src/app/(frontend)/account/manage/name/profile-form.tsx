'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/Input'
import { Message } from '@/components/message'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Loader2, Save, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/providers/Auth'

type FormData = {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

export const ProfileForm = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      password: '',
      passwordConfirm: '',
    }
  })

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        setIsSubmitting(true)
        setError('')
        setSuccess('')
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const json = await response.json()
            setUser(json.doc)
            setSuccess('Your profile has been successfully updated.')
            setError('')
            setActiveTab('profile')
            reset({
              email: json.doc.email,
              name: json.doc.name,
              password: '',
              passwordConfirm: '',
            })
          } else {
            const errorData = await response.json()
            setError(errorData.message || 'There was a problem updating your account.')
          }
        } catch (err) {
          setError('Network error. Please try again later.')
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [user, setUser, reset],
  )

  // Update form values when user data changes
  useEffect(() => {
    if (user === null) {
      router.push(
        `/auth/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account/manage')}`,
      )
    }

    // Once user is loaded, update form values
    if (user) {
      setValue('email', user.email || '')
      setValue('name', user.name || '')
      setValue('password', '')
      setValue('passwordConfirm', '')
    }
  }, [user, router, setValue])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="w-full">
      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md mb-6">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-sm">{success}</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md mb-6">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Password Settings</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="profile">
            <div className="space-y-5">
              <Input
                name="name"
                label="Full Name"
                register={register}
                error={errors.name}
                placeholder="Enter your full name"
              />
              
              <Input
                name="email"
                label="Email Address"
                required
                register={register}
                error={errors.email}
                type="email"
                placeholder="your.email@example.com"
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting} 
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="password">
            <div className="space-y-5">
              <div className="space-y-4">
                <Input
                  name="password"
                  type="password"
                  label="New Password"
                  required
                  register={register}
                  error={errors.password}
                  placeholder="Enter new password"
                />
                
                <Input
                  name="passwordConfirm"
                  type="password"
                  label="Confirm New Password"
                  required
                  register={register}
                  validate={(value) => value === password.current || 'The passwords do not match'}
                  error={errors.passwordConfirm}
                  placeholder="Confirm your new password"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting} 
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
