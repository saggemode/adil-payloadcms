import LoginForm from '@/components/auth/login-form'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Metadata } from 'next'
import { Suspense } from 'react'

const LoginPage = async () => {
  await getMeUser({
    validUserRedirect: `/user/profile?warning=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )

}

export default LoginPage
export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
  openGraph: mergeOpenGraph({
    title: 'Login',
    url: '/auth/login',
  }),
}
