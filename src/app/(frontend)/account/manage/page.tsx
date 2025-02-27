import { Metadata } from 'next'


import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import NameCard from './name/name-card'

export default function ProfilePage() {
  return (
    <>
      <NameCard />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Manage Account',
  description: 'Manage Your Account.',
  openGraph: mergeOpenGraph({
    title: 'User Account',
    url: '/account/manage',
  }),
}