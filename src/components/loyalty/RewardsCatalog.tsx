'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints'
import { useRewards } from '@/hooks/useRewards'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Reward as RewardType } from '@/payload-types'


const RewardsCatalogSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const RewardsCatalog = () => {
  const { user } = useAuth()
  const { 
    data: loyaltyPoints, 
    isLoading: isLoadingPoints, 
    error: pointsError,
    redeemPoints,
    isRedeeming
  } = useLoyaltyPoints(user?.id)
  
  const {
    data: rewards,
    isLoading: isLoadingRewards,
    error: rewardsError
  } = useRewards(user?.id?.toString())

  const handleRedeem = (reward: RewardType) => {
    if (!loyaltyPoints) return

    if (loyaltyPoints.points < reward.pointsCost) {
      toast({
        title: "Not enough points",
        description: "You don't have enough points to redeem this reward",
        variant: "destructive"
      })
      return
    }

    redeemPoints(
      { rewardId: reward.id.toString(), pointsCost: reward.pointsCost },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `Successfully redeemed ${reward.name} for ${reward.pointsCost} points! Your reward code will be sent to your email. Check your email inbox for redemption instructions.`,
            variant: "default",
            duration: 5000
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to redeem reward: ${error.message}`,
            variant: "destructive"
          })
        }
      }
    )
  }

  const isLoading = isLoadingPoints || isLoadingRewards
  const error = pointsError || rewardsError

  if (isLoading) {
    return <RewardsCatalogSkeleton />
  }

  if (error) {
    return <div className="text-foreground">Error loading rewards catalog</div>
  }

  if (!loyaltyPoints) {
    return <div className="text-foreground">Please log in to view rewards</div>
  }

  if (!rewards || rewards.length === 0) {
    return <div className="text-foreground">No rewards available at this time</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Rewards Catalog</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Your Points Balance</p>
          <p className="text-xl font-bold text-foreground">{loyaltyPoints.points.toLocaleString()} Points</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden">
            {reward.image && (
              <div className="h-40 w-full overflow-hidden relative">
                <Image 
                  src={typeof reward.image === 'number' ? `/api/media/${reward.image}` : (reward.image?.url || '/placeholder-image.jpg')}
                  alt={reward.name} 
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{reward.name}</CardTitle>
              <CardDescription>{reward.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{reward.pointsCost.toLocaleString()} Points</p>
              <p className="text-sm text-muted-foreground mt-1">
                Valid until: {format(new Date(reward.validUntil), 'MMM d, yyyy')}
              </p>
              {(reward.stock ?? 0) > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {reward.stock} available
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleRedeem(reward)}
                disabled={!reward.isActive || (reward.stock ?? 0) <= 0 || loyaltyPoints.points < reward.pointsCost || isRedeeming}
              >
                {isRedeeming 
                  ? 'Processing...' 
                  : !reward.isActive 
                    ? 'Not Available' 
                    : (reward.stock ?? 0) <= 0
                      ? 'Out of Stock'
                      : loyaltyPoints.points < reward.pointsCost 
                        ? 'Not Enough Points' 
                        : 'Redeem'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RewardsCatalog 