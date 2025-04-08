import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loyalty Rewards',
  description: 'Redeem your loyalty points for exclusive rewards and discounts',
}

export default async function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 p-4">
      <div className="max-w-5xl mx-auto space-y-4">{children}</div>
    </div>
  )
}
