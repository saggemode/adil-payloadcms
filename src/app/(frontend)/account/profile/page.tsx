import { Metadata } from 'next'


import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import ProfileForm from './profile-form'
import LoyaltyPointsDisplay from '@/components/loyalty/LoyaltyPointsDisplay'
//import ReferralStatsDisplay from '@/components/referral/ReferralStatsDisplay'

export default async function ProfilePage() {
  return (
    <div className="max-w-md  mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <LoyaltyPointsDisplay />
      {/* <ReferralStatsDisplay /> */}
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
