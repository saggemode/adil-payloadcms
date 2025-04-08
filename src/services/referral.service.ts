import payload from 'payload';
import { Referral, User } from '@/payload-types';
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface ReferralValidationResult {
  isValid: boolean;
  message: string;
  referrer?: {
    id: number;
    name?: string | null;
    email?: string | null;
  };
}

export interface ReferralProcessingResult {
  success: boolean;
  message: string;
  referralId?: number;
}

/**
 * Validates a referral code
 */
export async function validateReferralCode(code: string): Promise<ReferralValidationResult> {
  try {
    // Find user with this referral code
    const payload = await getPayload({ config: configPromise })
    const referrer = await payload.find({
      collection: 'users',
      where: {
        referralCode: {
          equals: code,
        },
      },
      limit: 1,
    });

    if (!referrer.docs.length) {
      return {
        isValid: false,
        message: 'Invalid referral code',
      };
    }

    const referrerUser = referrer.docs[0];
    if (!referrerUser) {
      return {
        isValid: false,
        message: 'Invalid referral code',
      };
    }

    return {
      isValid: true,
      message: 'Valid referral code',
      referrer: {
        id: referrerUser.id,
        name: referrerUser.name,
        email: referrerUser.email,
      },
    };
  } catch (error) {
    console.error('Error validating referral code:', error);
    return {
      isValid: false,
      message: 'Failed to validate referral code',
    };
  }
}

/**
 * Process a referral when a new user registers
 */
export async function processReferral(
  newUserId: string,
  referralCode: string
): Promise<ReferralProcessingResult> {
  try {
    // Find the referrer
    const payload = await getPayload({ config: configPromise })
    const referrerResult = await payload.find({
      collection: 'users',
      where: {
        referralCode: {
          equals: referralCode,
        },
      },
      limit: 1,
    });

    if (!referrerResult.docs.length) {
      return {
        success: false,
        message: 'Invalid referral code',
      };
    }

    const referrer = referrerResult.docs[0];
    if (!referrer) {
      return {
        success: false,
        message: 'Invalid referral code',
      };
    }
    const referrerId = referrer.id;

    // Check if user is trying to use their own referral code
    if (String(referrerId) === newUserId) {
      return {
        success: false,
        message: 'You cannot use your own referral code',
      };
    }

    // Create referral record
    
    const referral = await payload.create({
      collection: 'referrals',
      data: {
        referrer: referrerId,
        referredUser: Number(newUserId),
        referralCode: referralCode,
        status: 'pending',
        rewardTier: 1, // Default reward tier
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      },
    });

    // Update the new user to indicate they were referred
    await payload.update({
      collection: 'users',
      id: newUserId,
      data: {
        referredBy: referrerId,
      },
    });

    // Update referrer's stats
    const currentUser = await payload.findByID({
      collection: 'users',
      id: Number(referral.referrer),
    }) as User;

    if (currentUser) {
      await payload.update({
        collection: 'users',
        id: Number(referral.referrer),
        data: {
          totalReferrals: (currentUser.totalReferrals || 0) + 1,
          referralRewards: (currentUser.referralRewards || 0) + 10, // Default reward amount
        } as any,
      });
    }

    return {
      success: true,
      message: 'Referral processed successfully',
      referralId: referral.id,
    };
  } catch (error) {
    console.error('Error processing referral:', error);
    return {
      success: false,
      message: 'Failed to process referral',
    };
  }
}

/**
 * Complete a referral (e.g., when referred user makes a purchase)
 */
export async function completeReferral(referralId: string): Promise<ReferralProcessingResult> {
  try {
    // Find the referral
    const payload = await getPayload({ config: configPromise })
    const referral = await payload.findByID({
      collection: 'referrals',
      id: referralId,
    });

    if (!referral) {
      return {
        success: false,
        message: 'Referral not found',
      };
    }

    if (referral.status === 'completed') {
      return {
        success: false,
        message: 'Referral already completed',
      };
    }

    // Update referral status
    await payload.update({
      collection: 'referrals',
      id: referralId,
      data: {
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    });

    // Update referrer's stats
    const currentUser = await payload.findByID({
      collection: 'users',
      id: Number(referral.referrer),
    }) as User;

    if (currentUser) {
      await payload.update({
        collection: 'users',
        id: Number(referral.referrer),
        data: {
          totalReferrals: (currentUser.totalReferrals || 0) + 1,
          referralRewards: (currentUser.referralRewards || 0) + 10, // Default reward amount
        } as any,
      });
    }

    return {
      success: true,
      message: 'Referral completed successfully',
      referralId: Number(referralId),
    };
  } catch (error) {
    console.error('Error completing referral:', error);
    return {
      success: false,
      message: 'Failed to complete referral',
    };
  }
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string) {
  try {
    // Get all referrals by this user
    const payload = await getPayload({ config: configPromise })
    const referrals = await payload.find({
      collection: 'referrals',
      where: {
        referrer: {
          equals: userId,
        },
      },
    });

    const totalReferrals = referrals.totalDocs;
    const completedReferrals = referrals.docs.filter(
      (ref) => ref.status === 'completed'
    ).length;
    const pendingReferrals = totalReferrals - completedReferrals;

    // Calculate total rewards - using a fixed value for now
    // In a real implementation, you would fetch the reward tier details
    const totalRewards = completedReferrals * 10; // Default reward amount

    return {
      success: true,
      stats: {
        total: totalReferrals,
        completed: completedReferrals,
        pending: pendingReferrals,
        totalRewards,
      },
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return {
      success: false,
      message: 'Failed to get referral stats',
    };
  }
} 