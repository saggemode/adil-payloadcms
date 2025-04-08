'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/Auth'
import { getReferralStatsAction, syncReferralStatsAction } from '@/actions/referralAction'
import { Skeleton } from '@/components/ui/skeleton'
import { Share2, Users, CheckCircle, Clock, Gift, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ReferralStatsDisplayProps {
  userId?: string;
}

const ReferralStatsSkeleton = () => {
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

export default function ReferralStatsDisplay({ userId }: ReferralStatsDisplayProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalRewards: 0,
    userTotalReferrals: 0,
    userReferralRewards: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchReferralStats = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setIsLoading(true)
      const result = await getReferralStatsAction(user.id.toString())
      
      if (result.success && result.stats) {
        setStats({
          total: result.stats.totalReferrals,
          completed: result.stats.completedReferrals,
          pending: result.stats.pendingReferrals,
          totalRewards: result.stats.totalRewards,
          userTotalReferrals: result.stats.userTotalReferrals || 0,
          userReferralRewards: result.stats.userReferralRewards || 0,
        })
      } else {
        setError(result.message || 'Failed to fetch referral statistics')
      }
    } catch (err) {
      console.error('Error fetching referral stats:', err)
      setError('Failed to fetch referral statistics')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchReferralStats()
  }, [fetchReferralStats])

  const handleSyncStats = async () => {
    if (!user?.id) return
    
    try {
      setIsSyncing(true)
      const result = await syncReferralStatsAction(user.id.toString())
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        })
        // Refresh the stats
        fetchReferralStats()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error('Error syncing referral stats:', err)
      toast({
        title: 'Error',
        description: 'Failed to sync referral stats',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading) {
    return <ReferralStatsSkeleton />
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  // Check if there's a discrepancy between calculated total and user's totalReferrals
  const hasDiscrepancy = stats.total !== stats.userTotalReferrals

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Referral Program</span>
          <Badge className="bg-primary text-white">
            {stats.total > 0 ? 'Active' : 'New'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasDiscrepancy && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Stats Discrepancy Detected</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  We&apos;ve detected a discrepancy between your calculated referrals and stored total.
                  <button
                    onClick={handleSyncStats}
                    disabled={isSyncing}
                    className="ml-2 inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 mb-1 text-primary" />
              <span className="text-sm text-muted-foreground">Total Referrals</span>
              <span className="text-xl font-bold">{stats.total}</span>
              {hasDiscrepancy && (
                <span className="text-xs text-amber-600 mt-1">
                  (Stored: {stats.userTotalReferrals})
                </span>
              )}
            </div>
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <CheckCircle className="h-5 w-5 mb-1 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-xl font-bold">{stats.completed}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 mb-1 text-amber-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="text-xl font-bold">{stats.pending}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
              <Gift className="h-5 w-5 mb-1 text-purple-500" />
              <span className="text-sm text-muted-foreground">Total Rewards</span>
              <span className="text-xl font-bold">{stats.totalRewards}</span>
              {hasDiscrepancy && (
                <span className="text-xs text-amber-600 mt-1">
                  (Stored: {stats.userReferralRewards})
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Share your referral code with friends and earn rewards!
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="px-3 py-1 bg-muted rounded-md font-mono">
                {user?.referralCode || 'No code available'}
              </code>
              <button 
                className="p-1 rounded-full hover:bg-muted"
                onClick={() => {
                  if (user?.referralCode) {
                    navigator.clipboard.writeText(user.referralCode)
                    toast({
                      title: "Referral code copied!",
                      description: "Your referral code has been copied to clipboard.",
                      duration: 3000,
                    })
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 