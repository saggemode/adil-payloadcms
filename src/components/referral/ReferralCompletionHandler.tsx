'use client'

import { useEffect } from 'react'
import { useReferralCompletion } from '@/hooks/useReferralCompletion'
import { useAuth } from '@/providers/Auth'

interface ReferralCompletionHandlerProps {
  orderId: string
  onComplete?: () => void
}

export default function ReferralCompletionHandler({ 
  orderId, 
  onComplete 
}: ReferralCompletionHandlerProps) {
  const { user } = useAuth()
  const { completeReferral, isLoading } = useReferralCompletion({
    onSuccess: () => {
      console.log('Referral completed successfully')
      onComplete?.()
    }
  })

  useEffect(() => {
    const processReferral = async () => {
      // Only proceed if we have a user
      if (!user) {
        console.log('No user found, skipping referral completion')
        return
      }
      
      try {
        console.log('Processing referral for user:', user.id)
        console.log('User referredBy:', user.referredBy)
        
        // Check if this user was referred by someone
        if (user.referredBy) {
          console.log('User was referred by:', user.referredBy)
          
          // Find the referral record for this user
          const response = await fetch(`/api/referrals/user/${user.id}`)
          
          if (!response.ok) {
            console.error('Failed to fetch referral data:', response.status, response.statusText)
            return
          }
          
          const data = await response.json()
          console.log('Referral data:', data)
          
          // If we found a referral and it's not already completed
          if (data.referral && data.referral.status !== 'completed') {
            console.log('Completing referral:', data.referral.id)
            // Complete the referral
            await completeReferral(data.referral.id.toString())
          } else {
            console.log('No pending referral found or referral already completed')
          }
        } else {
          console.log('User was not referred by anyone')
        }
      } catch (error) {
        console.error('Error processing referral completion:', error)
      }
    }
    
    processReferral()
  }, [user, orderId, completeReferral, onComplete])

  // This component doesn't render anything
  return null
} 