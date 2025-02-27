import RegisterForm from '@/components/auth/register-form'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Metadata } from 'next'
import { Suspense } from 'react'

const RegisterPage = async () => {
  await getMeUser({
    validUserRedirect: `/auth/register?warning=${encodeURIComponent(
      'Cannot create a new account while logged in, please log out and try again.',
    )}`,
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage

export const metadata: Metadata = {
  title: 'Register An Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Register',
    url: '/auth/register',
  }),
}
