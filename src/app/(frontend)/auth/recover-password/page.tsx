import { RecoverPasswordForm } from '@/components/auth/recover-password-form'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Metadata } from 'next'
import { Suspense } from 'react'

const RecoverPasswordPage = () => {
 

   return (
     <Suspense fallback={<div>Loading...</div>}>
       <RecoverPasswordForm />
     </Suspense>
   )
}

export default RecoverPasswordPage

export const metadata: Metadata = {
  title: 'Recover Password',
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Recover Password',
    url: '/recover-password',
  }),
}