import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'
import { APP_NAME } from '@/constants'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ArrowLeft, ChevronRight, User2 } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="mb-24 w-full max-w-3xl mx-auto">
      <nav className="flex items-center gap-2 mb-6 text-sm">
        <Link 
          href="/account" 
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Account</span>
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
            Account
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <Link href="/account/manage" className="text-muted-foreground hover:text-foreground transition-colors">
            Login & Security
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground font-medium">Profile Name</span>
        </div>
      </nav>

      <Card className="w-full border-none shadow-md">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-primary/10">
              <User2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-medium">Update Your Profile Name</CardTitle>
              <CardDescription className="mt-1">
                Manage how your name appears across your {APP_NAME} account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              Your name is used for personalization and appears on receipts, invoices, and 
              communications from {APP_NAME}. Updating your name here will change it across 
              all your account services.
            </p>
          </div>
          <ProfileForm />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6 text-xs text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <Link href="/account/manage" className="hover:text-foreground transition-colors">
            Back to Login & Security
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Update Your Profile Name | Account Settings',
  description: 'Change the name associated with your account and how it appears across services.',
  openGraph: mergeOpenGraph({
    title: 'Update Your Profile Name',
    url: '/account/manage/name',
  }),
}