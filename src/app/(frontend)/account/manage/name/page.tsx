import { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { APP_NAME } from '@/constants'

export default function ProfilePage() {
  return (
    <div className="mb-24">
      <div className="flex gap-2 ">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <Link href="/account/manage">Login & Security</Link>
        <span>›</span>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-4 flex justify-between flex-wrap">
          <p className="text-sm py-2">
            If you want to change the name associated with your {APP_NAME}
            &apos;s account, you may do so below. Be sure to click the Save Changes button when you
            are done.
          </p>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Update Account',
  description: 'Update Your Account.',
  openGraph: mergeOpenGraph({
    title: 'User Account Update',
    url: '/account/manage/name',
  }),
}