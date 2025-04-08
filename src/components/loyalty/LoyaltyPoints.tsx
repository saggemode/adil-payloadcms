'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'
import { getLoyaltyPoints, getAvailableRewards, redeemReward } from '@/actions/loyaltyAction'
import { useToast } from '@/hooks/use-toast'
import type { Media } from '@/payload-types'


interface LoyaltyPoints {
  id: number
  customerId: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  pointsHistory?: {
    points: number
    type: 'earned' | 'redeemed' | 'expired' | 'adjusted'
    description: string
    createdAt: string
    id?: string | null
  }[] | null
  rewards?: {
    rewardId: string
    name: string
    pointsCost: number
    status: 'available' | 'redeemed' | 'expired'
    redeemedAt?: string | null
    id?: string | null
  }[] | null
  tierHistory?: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    changedAt: string
    reason: string
    id?: string | null
  }[] | null
  createdAt: string
  updatedAt: string
}

interface Reward {
  id: number
  name: string
  description: string
  pointsCost: number
  type: 'discount' | 'free_shipping' | 'free_product' | 'special_access'
  stock?: number | null | undefined
  isActive?: boolean | null
  image: number | Media
  createdAt: string
  updatedAt: string
}

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000,
}

export default function LoyaltyPoints({ customerId }: { customerId: string }) {
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pointsResponse = await getLoyaltyPoints(customerId)
        if (pointsResponse !== undefined) {
          setLoyaltyPoints(pointsResponse as unknown as LoyaltyPoints)
        } else {
          setLoyaltyPoints(null)
        }

        const rewardsResponse = await getAvailableRewards(customerId)
        if (rewardsResponse.success) {
          setRewards(rewardsResponse.data || [])
        }
      } catch (error) {
        console.error('Error fetching loyalty data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load loyalty points data',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [customerId, toast])

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const response = await redeemReward(customerId, rewardId)
      if (response.success && response.data) {
        setLoyaltyPoints(response.data as unknown as LoyaltyPoints)
        toast({
          title: 'Success',
          description: 'Reward redeemed successfully!',
        })
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to redeem reward',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      toast({
        title: 'Error',
        description: 'Failed to redeem reward',
        variant: 'destructive',
      })
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-r from-gray-400 to-gray-600'
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 'silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-400'
      default:
        return 'bg-gradient-to-r from-amber-700 to-amber-900'
    }
  }

  const getNextTier = () => {
    if (!loyaltyPoints) return null
    const tiers = ['bronze', 'silver', 'gold', 'platinum']
    const currentIndex = tiers.indexOf(loyaltyPoints.tier)
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null
  }

  const getProgressToNextTier = () => {
    if (!loyaltyPoints || !getNextTier()) return 0
    const currentPoints = loyaltyPoints.points
    const currentTierThreshold = TIER_THRESHOLDS[loyaltyPoints.tier as keyof typeof TIER_THRESHOLDS]
    const nextTierThreshold = TIER_THRESHOLDS[getNextTier()! as keyof typeof TIER_THRESHOLDS]
    const progress = ((currentPoints - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!loyaltyPoints) {
    return <div>No loyalty points found</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Loyalty Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{loyaltyPoints.points} points</div>
              <div className="flex items-center space-x-2">
                <div className={`h-6 w-6 rounded-full ${getTierColor(loyaltyPoints.tier)}`} />
                <span className="capitalize">{loyaltyPoints.tier} Member</span>
              </div>
            </div>
            {getNextTier() && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {TIER_THRESHOLDS[getNextTier()! as keyof typeof TIER_THRESHOLDS] - loyaltyPoints.points} points to{' '}
                  <span className="capitalize">{getNextTier()}</span>
                </div>
                <Progress value={getProgressToNextTier()} className="w-[200px]" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader>
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={typeof reward.image === 'number' ? '' : (reward.image.url || '')}
                      alt={reward.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="mt-4">{reward.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">{reward.pointsCost} points</Badge>
                    <Button
                      onClick={() => handleRedeemReward(reward.id.toString())}
                      disabled={loyaltyPoints.points < reward.pointsCost || reward.stock === 0}
                    >
                      Redeem
                    </Button>
                  </div>
                  {reward.stock === 0 && (
                    <p className="mt-2 text-sm text-red-500">Out of stock</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loyaltyPoints.pointsHistory?.map((history, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <div className="font-medium">{history.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(history.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <Badge
                  variant={
                    history.type === 'earned'
                      ? 'default'
                      : history.type === 'redeemed'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {history.type === 'earned' ? '+' : ''}
                  {history.points}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 