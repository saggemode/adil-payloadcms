import { Metadata } from 'next'


import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
  return (
    <div className="max-w-md  mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfileForm />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'User Account',
    url: '/user/profile',
  }),
}
