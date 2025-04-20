import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import ProfileForm from './profile-form'
import LoyaltyPointsDisplay from '@/components/loyalty/LoyaltyPointsDisplay'
import ReferralStatsDisplay from '@/components/referral/ReferralStatsDisplay'

export default async function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="h2-bold mb-6">My Account</h2>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>
      
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your account details and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <LoyaltyPointsDisplay />
        </TabsContent>
        
        <TabsContent value="referrals" className="space-y-6">
          <ReferralStatsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'My Account | Profile',
  description: 'Manage your account details, loyalty points, and referral program.',
  openGraph: mergeOpenGraph({
    title: 'My Account | Profile',
    url: '/account/profile',
  }),
}
