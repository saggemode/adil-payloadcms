import { useState } from 'react'
import { completeReferralAction } from '@/actions/referralAction'
import { useToast } from '@/hooks/use-toast'

interface UseReferralCompletionProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useReferralCompletion({ onSuccess, onError }: UseReferralCompletionProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const completeReferral = async (referralId: string) => {
    if (!referralId) {
      const error = 'No referral ID provided'
      onError?.(error)
      return { success: false, message: error }
    }

    try {
      setIsLoading(true)
      const result = await completeReferralAction(referralId)
      
      if (result.success) {
        toast({
          title: "Referral completed!",
          description: "You've earned rewards for this referral.",
          duration: 5000,
        })
        onSuccess?.()
      } else {
        toast({
          title: "Referral completion failed",
          description: result.message || "Could not complete the referral.",
          variant: "destructive",
          duration: 5000,
        })
        onError?.(result.message || "Could not complete the referral.")
      }
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Error completing referral",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
      onError?.(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    completeReferral,
    isLoading
  }
} 