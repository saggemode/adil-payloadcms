'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Types
interface LoyaltyPoint {
  id: number;
  customerId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsHistory?:
    | {
        points: number;
        type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
        description: string;
        createdAt?: string;
        id?: string | null;
      }[]
    | null;
  rewards?:
    | {
        rewardId: string;
        name: string;
        pointsCost: number;
        status: 'available' | 'redeemed' | 'expired';
        redeemedAt?: string | null;
        id?: string | null;
      }[]
    | null;
  tierHistory?:
    | {
        tier: 'bronze' | 'silver' | 'gold' | 'platinum';
        changedAt?: string;
        reason: string;
        id?: string | null;
      }[]
    | null;
  createdAt: string;
  updatedAt: string;
}

// Type guard to check if a value is a single LoyaltyPoint
function isLoyaltyPoint(value: LoyaltyPoint | LoyaltyPoint[] | null): value is LoyaltyPoint {
  return value !== null && !Array.isArray(value) && 'id' in value && 'points' in value
}

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000,
}

function calculateTier(points: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (points >= TIER_THRESHOLDS.platinum) return 'platinum'
  if (points >= TIER_THRESHOLDS.gold) return 'gold'
  if (points >= TIER_THRESHOLDS.silver) return 'silver'
  return 'bronze'
}

// Get loyalty points for a customer or all customers
export async function getLoyaltyPoints(customerId: string): Promise<LoyaltyPoint | LoyaltyPoint[] | null> {
  const payload = await getPayload({ config: configPromise })
  
  try {
    console.log('Fetching loyalty points for:', customerId)
    // Ensure customerId is properly formatted as a string
    const formattedCustomerId = String(customerId).trim()
    
    const loyaltyPoints = await payload.find({
      collection: 'loyalty-points',
      where: formattedCustomerId === 'all' ? {} : {
        customerId: {
          equals: formattedCustomerId,
        },
      },
    })

    console.log('Found loyalty points:', loyaltyPoints.docs)
    
    if (formattedCustomerId === 'all') {
      return loyaltyPoints.docs as LoyaltyPoint[]
    }
    
    return loyaltyPoints.docs[0] as LoyaltyPoint || null
  } catch (error) {
    console.error('Error fetching loyalty points:', error)
    return null
  }
}

// Create or update loyalty points for a customer
export async function createOrUpdateLoyaltyPoints(customerId: string, initialPoints: number = 0): Promise<LoyaltyPoint | null> {
  const payload = await getPayload({ config: configPromise })
  
  try {
    console.log('Creating/updating loyalty points for customer:', customerId)
    // Ensure customerId is properly formatted as a string
    const formattedCustomerId = String(customerId).trim()
    
    const existingPoints = await getLoyaltyPoints(formattedCustomerId)
    
    if (isLoyaltyPoint(existingPoints)) {
      console.log('Found existing points:', existingPoints)
      return existingPoints
    }

    console.log('Creating new loyalty points account')
    const newLoyaltyPoints = await payload.create({
      collection: 'loyalty-points',
      data: {
        customerId: formattedCustomerId,
        points: initialPoints,
        tier: 'bronze',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pointsHistory: [
          {
            points: initialPoints,
            type: 'earned',
            description: 'Initial points',
            createdAt: new Date().toISOString(),
          },
        ],
        tierHistory: [
          {
            tier: 'bronze',
            changedAt: new Date().toISOString(),
            reason: 'Initial tier assignment',
          },
        ],
      },
    })

    console.log('Created new loyalty points:', newLoyaltyPoints)
    return newLoyaltyPoints
  } catch (error) {
    console.error('Error creating loyalty points:', error)
    return null
  }
}

// Add points to a customer's account
export async function addPoints(customerId: string, points: number, description: string) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const loyaltyPoints = await getLoyaltyPoints(customerId)
    if (!isLoyaltyPoint(loyaltyPoints)) {
      return { success: false, message: 'Customer not found' }
    }

    const newPoints = loyaltyPoints.points + points
    const newTier = calculateTier(newPoints)

    const updatedPoints = await payload.update({
      collection: 'loyalty-points',
      id: loyaltyPoints.id,
      data: {
        points: newPoints,
        tier: newTier,
        pointsHistory: [
          ...(loyaltyPoints.pointsHistory || []),
          {
            points,
            type: 'earned',
            description,
            createdAt: new Date().toISOString(),
          },
        ],
        ...(newTier !== loyaltyPoints.tier && {
          tierHistory: [
            ...(loyaltyPoints.tierHistory || []),
            {
              tier: newTier,
              changedAt: new Date().toISOString(),
              reason: `Points threshold reached for ${newTier} tier`,
            },
          ],
        }),
      },
    })

    return { success: true, data: updatedPoints }
  } catch (error) {
    console.error('Error adding points:', error)
    return { success: false, message: 'Failed to add points' }
  }
}

// Redeem points for a reward
export async function redeemReward(customerId: string, rewardId: string) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const loyaltyPoints = await getLoyaltyPoints(customerId)
    if (!isLoyaltyPoint(loyaltyPoints)) {
      return { success: false, message: 'Customer not found' }
    }

    const reward = await payload.findByID({
      collection: 'rewards',
      id: rewardId,
    })

    if (!reward) {
      return { success: false, message: 'Reward not found' }
    }

    if (loyaltyPoints.points < reward.pointsCost) {
      return { success: false, message: 'Insufficient points' }
    }

    if (reward.stock === null || reward.stock === undefined || reward.stock <= 0) {
      return { success: false, message: 'Reward out of stock' }
    }

    const updatedPoints = await payload.update({
      collection: 'loyalty-points',
      id: loyaltyPoints.id,
      data: {
        points: loyaltyPoints.points - reward.pointsCost,
        pointsHistory: [
          ...(loyaltyPoints.pointsHistory || []),
          {
            points: -reward.pointsCost,
            type: 'redeemed',
            description: `Redeemed reward: ${reward.name}`,
            createdAt: new Date().toISOString(),
          },
        ],
        rewards: [
          ...(loyaltyPoints.rewards || []),
          {
            rewardId,
            name: reward.name,
            pointsCost: reward.pointsCost,
            status: 'redeemed',
            redeemedAt: new Date().toISOString(),
          },
        ],
      },
    })

    // Update reward stock
    await payload.update({
      collection: 'rewards',
      id: rewardId,
      data: {
        stock: (reward.stock === null || reward.stock === undefined) ? 0 : reward.stock - 1,
      },
    })

    return { success: true, data: updatedPoints }
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return { success: false, message: 'Failed to redeem reward' }
  }
}

// Get available rewards for a customer
export async function getAvailableRewards(customerId: string) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const loyaltyPoints = await getLoyaltyPoints(customerId)
    if (!isLoyaltyPoint(loyaltyPoints)) {
      return { success: false, message: 'Customer not found' }
    }

    const rewards = await payload.find({
      collection: 'rewards',
      where: {
        isActive: {
          equals: true,
        },
        validFrom: {
          less_than_equal: new Date().toISOString(),
        },
        validUntil: {
          greater_than_equal: new Date().toISOString(),
        },
        stock: {
          greater_than: 0,
        },
        tierRestrictions: {
          contains: loyaltyPoints.tier,
        },
      },
    })

    return { success: true, data: rewards.docs }
  } catch (error) {
    console.error('Error fetching available rewards:', error)
    return { success: false, message: 'Failed to fetch rewards' }
  }
}

// Get tier benefits
export async function getTierBenefits(tier: 'bronze' | 'silver' | 'gold' | 'platinum') {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const rewards = await payload.find({
      collection: 'rewards',
      where: {
        isActive: {
          equals: true,
        },
        tierRestrictions: {
          contains: tier,
        },
      },
    })

    return { success: true, data: rewards.docs }
  } catch (error) {
    console.error('Error fetching tier benefits:', error)
    return { success: false, message: 'Failed to fetch tier benefits' }
  }
}

// Add points from a purchase
export async function earnPointsFromPurchase(customerId: string, orderTotal: number) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    console.log('Earning points for customer:', customerId, 'with total:', orderTotal)
    // Calculate points based on order total (1 point per dollar)
    const points = Math.floor(orderTotal)
    
    // Get or create loyalty points for the customer
    let loyaltyPoints = await getLoyaltyPoints(customerId)
    console.log('Existing loyalty points:', loyaltyPoints)
    
    if (!isLoyaltyPoint(loyaltyPoints)) {
      console.log('Creating new loyalty points for customer')
      // Ensure customerId is properly formatted as a string
      const formattedCustomerId = String(customerId).trim()
      loyaltyPoints = await createOrUpdateLoyaltyPoints(formattedCustomerId)
    }

    if (!isLoyaltyPoint(loyaltyPoints)) {
      console.error('Failed to create loyalty points')
      return { success: false, message: 'Failed to create loyalty points' }
    }

    // Calculate new points and tier
    const newPoints = loyaltyPoints.points + points
    const newTier = calculateTier(newPoints)

    // Add points to the customer's account
    const updatedPoints = await payload.update({
      collection: 'loyalty-points',
      id: loyaltyPoints.id,
      data: {
        points: newPoints,
        tier: newTier,
        pointsHistory: [
          ...(loyaltyPoints.pointsHistory || []),
          {
            points,
            type: 'earned',
            description: `Earned ${points} points from purchase`,
            createdAt: new Date().toISOString(),
          },
        ],
        ...(newTier !== loyaltyPoints.tier && {
          tierHistory: [
            ...(loyaltyPoints.tierHistory || []),
            {
              tier: newTier,
              changedAt: new Date().toISOString(),
              reason: `Points threshold reached for ${newTier} tier`,
            },
          ],
        }),
      },
    })

    console.log('Updated loyalty points:', updatedPoints)
    return { success: true, data: updatedPoints }
  } catch (error) {
    console.error('Error earning points from purchase:', error)
    return { success: false, message: 'Failed to earn points' }
  }
}

// Handle points expiration
export async function handlePointsExpiration(customerId: string) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const loyaltyPoints = await getLoyaltyPoints(customerId)
    if (!isLoyaltyPoint(loyaltyPoints)) {
      return { success: false, message: 'Customer not found' }
    }

    // Get points that are older than 1 year
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const expiredPoints = loyaltyPoints.pointsHistory?.filter(
      (history) => 
        history.type === 'earned' && 
        history.createdAt && 
        new Date(history.createdAt) < oneYearAgo
    ) || []

    if (expiredPoints.length === 0) {
      return { success: true, data: loyaltyPoints }
    }

    // Calculate total expired points
    const totalExpiredPoints = expiredPoints.reduce((sum, history) => sum + history.points, 0)

    // Update points history to mark points as expired
    const updatedPointsHistory = loyaltyPoints.pointsHistory?.map(history => {
      if (expiredPoints.includes(history)) {
        return {
          ...history,
          type: 'expired' as const,
          description: `${history.points} points expired`,
        }
      }
      return history
    })

    // Update loyalty points
    const updatedPoints = await payload.update({
      collection: 'loyalty-points',
      id: loyaltyPoints.id,
      data: {
        points: loyaltyPoints.points - totalExpiredPoints,
        pointsHistory: updatedPointsHistory,
      },
    })

    return { success: true, data: updatedPoints }
  } catch (error) {
    console.error('Error handling points expiration:', error)
    return { success: false, message: 'Failed to handle points expiration' }
  }
}

// Redeem points for a reward
export async function redeemPoints(customerId: string, rewardId: string, pointsCost: number): Promise<LoyaltyPoint | null> {
  const payload = await getPayload({ config: configPromise })
  
  try {
    console.log('Redeeming points for customer:', customerId, 'reward:', rewardId, 'points:', pointsCost)
    const existingPoints = await getLoyaltyPoints(customerId)
    
    if (!isLoyaltyPoint(existingPoints)) {
      console.error('No loyalty points found for customer:', customerId)
      return null
    }
    
    if (existingPoints.points < pointsCost) {
      console.error('Not enough points for redemption:', existingPoints.points, 'needed:', pointsCost)
      return null
    }
    
    // Create a new points history entry
    const newHistoryEntry = {
      points: -pointsCost,
      type: 'redeemed' as const,
      description: `Redeemed for reward: ${rewardId}`,
      createdAt: new Date().toISOString(),
    }
    
    // Update the loyalty points
    const updatedPoints = await payload.update({
      collection: 'loyalty-points',
      id: existingPoints.id,
      data: {
        points: existingPoints.points - pointsCost,
        tier: calculateTier(existingPoints.points - pointsCost),
        pointsHistory: [
          ...(existingPoints.pointsHistory || []),
          newHistoryEntry,
        ],
        rewards: [
          ...(existingPoints.rewards || []),
          {
            rewardId,
            name: `Reward: ${rewardId}`, // In a real implementation, you would fetch the reward name
            pointsCost,
            status: 'redeemed',
            redeemedAt: new Date().toISOString(),
          },
        ],
      },
    })
    
    console.log('Successfully redeemed points:', updatedPoints)
    return updatedPoints as LoyaltyPoint
  } catch (error) {
    console.error('Error redeeming points:', error)
    return null
  }
}

// Get loyalty points summary for use in account dashboard
export async function getLoyaltyPointsSummary(customerId: string) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    // Ensure customerId is properly formatted as a string
    const formattedCustomerId = String(customerId).trim()
    
    const loyaltyPoints = await payload.find({
      collection: 'loyalty-points',
      where: {
        customerId: {
          equals: formattedCustomerId,
        },
      },
    })
    
    const pointsData = loyaltyPoints.docs[0]
    
    if (!pointsData) {
      return {
        points: 0,
        tier: 'bronze' as const,
        latestActivity: null,
        lastEarnedPoints: 0
      }
    }

    // Get the most recent activity from pointsHistory
    const history = pointsData.pointsHistory || []
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    const latestActivity = sortedHistory.length > 0 ? sortedHistory[0]?.createdAt : null
    
    // Find the most recent earned points entry
    const lastEarnedEntry = sortedHistory.find(entry => entry.type === 'earned' && entry.points > 0)
    const lastEarnedPoints = lastEarnedEntry?.points || 0

    return {
      points: pointsData.points || 0,
      tier: pointsData.tier || 'bronze',
      latestActivity,
      lastEarnedPoints
    }
  } catch (error) {
    console.error('Error fetching loyalty points summary:', error)
    return {
      points: 0,
      tier: 'bronze' as const,
      latestActivity: null,
      lastEarnedPoints: 0
    }
  }
} 