import React from 'react'
import RedeemedRewards from '@/components/loyalty/RedeemedRewards'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const PAGE_TITLE = 'Your Redeemed Rewards'
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: 'View your history of redeemed loyalty rewards.',
}

export default function RewardsHistoryPage() {
  return (
    <div className="container py-8">
     
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/rewards">
            <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Rewards Catalog
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-foreground">Your Redeemed Rewards</h1>
        <p className="text-muted-foreground mb-8">
          View your history of redeemed rewards and track your loyalty program activity.
        </p>
        
        <RedeemedRewards />
      </div>
    </div>
  )
} 