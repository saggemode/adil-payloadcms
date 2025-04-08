'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/Auth'
import { useLoyaltyPoints, LoyaltyPoint } from '@/hooks/useLoyaltyPoints'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const LoyaltyPointsSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const LoyaltyPointsDisplay = () => {
  const { user } = useAuth()
  const { data: loyaltyPoints, isLoading, error } = useLoyaltyPoints(user?.id)

  if (isLoading) {
    return <LoyaltyPointsSkeleton />
  }

  if (error) {
    return <div>Error loading loyalty points</div>
  }

  if (!loyaltyPoints) {
    return null
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-600'
      case 'silver':
        return 'bg-gray-400'
      case 'gold':
        return 'bg-yellow-500'
      case 'platinum':
        return 'bg-blue-400'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Loyalty Points</span>
          <Badge className={`${getTierColor(loyaltyPoints.tier)} text-white`}>
            {loyaltyPoints.tier.charAt(0).toUpperCase() + loyaltyPoints.tier.slice(1)} Tier
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">
            {loyaltyPoints.points.toLocaleString()} Points
          </div>
          
          <Link href="/rewards">
            <Button className="w-full">View Rewards Catalog</Button>
          </Link>
          
          {loyaltyPoints.pointsHistory && loyaltyPoints.pointsHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="space-y-1">
                {loyaltyPoints.pointsHistory.slice(0, 3).map((history, index) => (
                  <div key={index} className="text-sm">
                    <span className={history.type === 'earned' ? 'text-green-600' : 'text-red-600'}>
                      {history.type === 'earned' ? '+' : '-'}{Math.abs(history.points)} points
                    </span>
                    <span className="text-gray-600"> - {history.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LoyaltyPointsDisplay 