import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'
import { APP_NAME } from '@/constants'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ChevronRight } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="mb-24">
      <nav className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Link href="/account" className="hover:text-foreground transition-colors">
          Your Account
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/account/manage" className="hover:text-foreground transition-colors">
          Login & Security
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Update Name</span>
      </nav>

      <Card className="max-w-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Update Your Name</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            If you want to change the name associated with your {APP_NAME} account, you may do so below. 
            Be sure to click the Save Changes button when you are done.
          </p>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Update Your Name | Account Settings',
  description: 'Change the name associated with your account.',
  openGraph: mergeOpenGraph({
    title: 'Update Your Account Name',
    url: '/account/manage/name',
  }),
}