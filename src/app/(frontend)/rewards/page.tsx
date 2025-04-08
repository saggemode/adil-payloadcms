import React from 'react'
import RewardsCatalog from '@/components/loyalty/RewardsCatalog'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { History } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'


export const metadata: Metadata = {
  title: 'Loyalty Rewards | Your Store',
  description: 'Redeem your loyalty points for exclusive rewards, discounts, and special offers.',
}

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="h1-bold mb-8">Loyalty Rewards</h1>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-muted-foreground mb-6">
            Redeem your loyalty points for exclusive rewards, discounts, and special offers.
            The more points you earn, the more rewards you can unlock!
          </p>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground flex-shrink-0">1</span>
                  <span className="text-muted-foreground">Earn points with every purchase you make</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground flex-shrink-0">2</span>
                  <span className="text-muted-foreground">Browse available rewards in the catalog below</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground flex-shrink-0">3</span>
                  <span className="text-muted-foreground">Redeem your points for the rewards you want</span>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Link href="/rewards/history">
              <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <History className="h-4 w-4" />
                View Your Redeemed Rewards
              </Button>
            </Link>
          </div>
        </div>
        
        <RewardsCatalog />
      </div>
    </div>
  )
} 