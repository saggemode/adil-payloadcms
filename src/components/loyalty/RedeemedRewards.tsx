'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/providers/Auth'
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

const RedeemedRewardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const RedeemedRewards = () => {
  const { user } = useAuth()
  const { 
    data: loyaltyPoints, 
    isLoading, 
    error 
  } = useLoyaltyPoints(user?.id)

  if (isLoading) {
    return <RedeemedRewardsSkeleton />
  }

  if (error) {
    return <div className="text-foreground">Error loading redeemed rewards</div>
  }

  if (!loyaltyPoints) {
    return <div className="text-foreground">Please log in to view your redeemed rewards</div>
  }

  const redeemedRewards = loyaltyPoints.rewards?.filter(reward => reward.status === 'redeemed') || []

  if (redeemedRewards.length === 0) {
    return (
      <div>
        <h1 className="h1-bold py-4">Your Redeemed Rewards</h1>
        <Card>
          <CardContent className="p-6">
            <div>
              <h2 className="text-xl font-bold">No Rewards Yet</h2>
              <p className="text-muted-foreground">
                Start earning points with your purchases and redeem them for exclusive rewards!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="h1-bold py-4">Your Redeemed Rewards</h1>
      <div className="grid gap-4">
        {redeemedRewards.map((reward) => (
          <Card key={reward.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{reward.name}</h2>
                  <p className="text-muted-foreground">{reward.pointsCost.toLocaleString()} Points</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Redeemed on: {reward.redeemedAt ? format(new Date(reward.redeemedAt), 'MMM d, yyyy') : 'Unknown date'}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  Redeemed
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RedeemedRewards 