'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/Input'
import { Eye, EyeOff, Loader2, Save, UserCircle } from 'lucide-react'
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormError } from '@/components/auth/form-error'
import { FormSuccess } from '@/components/auth/form-success'
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator'

type FormData = {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

const ProfileForm = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>()

  const password = watch('password', '')
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        setIsLoading(true)
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
            setSuccess('Your account has been updated successfully.')
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
          setError('Network error. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    },
    [user, setUser, reset],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/auth/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account/profile')}`,
      )
    }

    if (user) {
      reset({
        email: user.email ?? '',
        name: user.name ?? '',
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset])

  if (!user) {
    return (
      <div className="flex justify-center items-center w-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        <CardDescription>
          Manage your account details and password
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password">
            <Eye className="mr-2 h-4 w-4" />
            Password
          </TabsTrigger>
        </TabsList>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && <FormSuccess message={success} />}
            {error && <FormError message={error} />}
            
            <TabsContent value="profile" className="space-y-4">
              <Input
                name="email"
                label="Email Address"
                type="email"
                required
                register={register}
                error={errors.email}
                disabled={isLoading}
              />
              <Input 
                name="name" 
                label="Name" 
                register={register} 
                error={errors.name}
                disabled={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="password" className="space-y-4">
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="New Password"
                  required={activeTab === 'password'}
                  register={register}
                  error={errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {password && <PasswordStrengthIndicator password={password} />}
              
              <div className="relative">
                <Input
                  name="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm New Password"
                  required={activeTab === 'password'}
                  register={register}
                  validate={(value) => 
                    !password || value === password || 'The passwords do not match'
                  }
                  error={errors.passwordConfirm}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </TabsContent>
            
            <CardFooter className="px-0 flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default ProfileForm
