import { User } from "@/payload-types"
import { CollectionBeforeChangeHook } from "payload"


export const handleReferral: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  const { payload } = req

  if (operation === 'create') {
    // Record the attempt first
    const attemptData = {
      referralCode: data.referralCode,
      attemptedBy: data.referredUser,
      status: 'pending' as const,
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
    }

    // Check if the referred user already has any referrals
    const existingReferrals = await payload.find({
      collection: 'referrals',
      where: {
        referredUser: {
          equals: data.referredUser,
        },
      },
    })

    if (existingReferrals.totalDocs > 0) {
      // Record failed attempt
      await payload.create({
        collection: 'referral-attempts' as any, // Type assertion needed until collection is registered
        data: {
          ...attemptData,
          status: 'failed' as any, // Type assertion needed until collection is registered
          failureReason: 'already_referred',
          failureDetails: 'User has already been referred by someone else',
        },
      })
      throw new Error('This user has already been referred by someone else')
    }

    // Get the referrer's code
    const referrer = await payload.findByID({
      collection: 'users',
      id: data.referrer,
    }) as unknown as User
    
    // Use the referrer's code
    data.referralCode = referrer.referralCode

    // Record successful attempt
    await payload.create({
      collection: 'referral-attempts' as any, // Type assertion needed until collection is registered
      data: {
        ...attemptData,
        status: 'success' as any, // Type assertion needed until collection is registered
      },
    })
  }

  if (operation === 'update' && data.status === 'completed') {
    // Get current user points
    const referrer = await payload.findByID({
      collection: 'users',
      id: data.referrer,
    }) as unknown as User

    const referredUser = await payload.findByID({
      collection: 'users',
      id: data.referredUser,
    }) as unknown as User

    // Get the reward tier
    const rewardTier = await payload.findByID({
      collection: 'referral-rewards',
      id: data.rewardTier,
    })

    // Calculate points based on reward tier
    let referrerPoints = 0
    let referredPoints = 0
    
    if (rewardTier) {
      if (rewardTier.rewardType === 'fixed') {
        referrerPoints = rewardTier.rewardAmount || 0
        referredPoints = Math.floor(referrerPoints * 0.5)
      } else if (rewardTier.rewardType === 'percentage' && data.purchaseAmount) {
        // Calculate percentage-based reward
        const percentage = rewardTier.rewardPercentage || 0
        referrerPoints = Math.floor(data.purchaseAmount * (percentage / 100))
        referredPoints = Math.floor(referrerPoints * 0.5)
      }
    }

    // Update referrer's loyalty points
    await payload.update({
      collection: 'users',
      id: data.referrer,
      data: {
        loyaltyPoints: (referrer.loyaltyPoints || 0) + referrerPoints,
      } as any,
    })

    // Update referred user's loyalty points (usually a smaller amount)
    await payload.update({
      collection: 'users',
      id: data.referredUser,
      data: {
        loyaltyPoints: (referredUser.loyaltyPoints || 0) + referredPoints,
      } as any,
    })

    // Set completedAt date
    data.completedAt = new Date().toISOString()
  }

  return data
}

// Helper function to generate a unique referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLength = 8
  let code = ''
  
  for (let i = 0; i < codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code
} 