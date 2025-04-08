'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Server action to validate a referral code
 */
export async function validateReferralCodeAction(code: string) {
  try {
    if (!code || typeof code !== 'string') {
      console.error('Invalid code format:', code);
      return {
        isValid: false,
        message: 'Invalid referral code format',
      };
    }

    // Trim whitespace and normalize the code
    const normalizedCode = code.trim();

    console.log('Validating referral code:', normalizedCode);

    try {
      // Find user with this referral code
      const payload = await getPayload({ config: configPromise })
      const referrer = await payload.find({
        collection: 'users',
        where: {
          referralCode: {
            equals: normalizedCode,
          },
        },
        limit: 1,
      });

      console.log('Referrer search result:', referrer);

      if (!referrer.docs || !referrer.docs.length) {
        console.log('No referrer found for code:', normalizedCode);
        return {
          isValid: false,
          message: 'Invalid referral code',
        };
      }

      const referrerUser = referrer.docs[0];
      if (!referrerUser) {
        console.log('Referrer user is null or undefined');
        return {
          isValid: false,
          message: 'Invalid referral code',
        };
      }

      console.log('Valid referrer found:', {
        id: referrerUser.id,
        name: referrerUser.name,
        email: referrerUser.email,
      });

      return {
        isValid: true,
        message: 'Valid referral code',
        referrer: {
          id: referrerUser.id,
          name: referrerUser.name,
          email: referrerUser.email,
        },
      };
    } catch (dbError) {
      console.error('Database error in validateReferralCodeAction:', dbError);
      return {
        isValid: false,
        message: 'System error: Unable to validate referral code',
      };
    }
  } catch (error) {
    console.error('Error in validateReferralCodeAction:', error);
    return {
      isValid: false,
      message: 'Failed to validate referral code. Please try again.',
    };
  }
}

/**
 * Server action to process a new referral
 */
export async function processReferralAction(newUserId: string, referralCode: string) {
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

    // Check if a referral already exists for this user
    const existingReferral = await payload.find({
      collection: 'referrals',
      where: {
        referredUser: {
          equals: Number(newUserId),
        },
      },
      limit: 1,
    });

    if (existingReferral.docs.length > 0) {
      return {
        success: false,
        message: 'You have already used a referral code',
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
    });

    if (currentUser) {
      await payload.update({
        collection: 'users',
        id: Number(referral.referrer),
        data: {
          totalReferrals: (currentUser.totalReferrals || 0) + 1,
          referralRewards: (currentUser.referralRewards || 0) + 10, // Default reward amount
        },
      });
    }

    // Use a dynamic import to avoid the revalidation during render
    try {
      const { revalidatePath } = await import('next/cache')
      revalidatePath('/dashboard/referrals')
    } catch (revalidateError) {
      console.error('Error revalidating paths:', revalidateError)
    }
    
    return {
      success: true,
      message: 'Referral processed successfully',
      referralId: referral.id,
    };
  } catch (error) {
    console.error('Error in processReferralAction:', error);
    return {
      success: false,
      message: 'Failed to process referral',
    };
  }
}

/**
 * Server action to complete a referral
 */
export async function completeReferralAction(referralId: string) {
  try {
    console.log('Completing referral with ID:', referralId)
    
    // Find the referral
    const payload = await getPayload({ config: configPromise })
    const referral = await payload.findByID({
      collection: 'referrals',
      id: referralId,
    });

    if (!referral) {
      console.error('Referral not found with ID:', referralId)
      return {
        success: false,
        message: 'Referral not found',
      };
    }

    console.log('Found referral:', {
      id: referral.id,
      status: referral.status,
      referrer: referral.referrer,
      referredUser: referral.referredUser
    })

    if (referral.status === 'completed') {
      console.log('Referral already completed')
      return {
        success: false,
        message: 'Referral already completed',
      };
    }

    // Update referral status
    console.log('Updating referral status to completed')
    await payload.update({
      collection: 'referrals',
      id: referralId,
      data: {
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    });

    // Update referrer's stats
    console.log('Updating referrer stats for ID:', referral.referrer)
    const currentUser = await payload.findByID({
      collection: 'users',
      id: Number(referral.referrer),
    });

    if (currentUser) {
      console.log('Current referrer stats:', {
        totalReferrals: currentUser.totalReferrals || 0,
        referralRewards: currentUser.referralRewards || 0
      })
      
      const newTotalReferrals = (currentUser.totalReferrals || 0) + 1
      const newReferralRewards = (currentUser.referralRewards || 0) + 10 // Default reward amount
      
      console.log('Updating to new stats:', {
        totalReferrals: newTotalReferrals,
        referralRewards: newReferralRewards
      })
      
      await payload.update({
        collection: 'users',
        id: Number(referral.referrer),
        data: {
          totalReferrals: newTotalReferrals,
          referralRewards: newReferralRewards,
        },
      });
      
      console.log('Referrer stats updated successfully')
    } else {
      console.error('Referrer user not found with ID:', referral.referrer)
    }

    // Revalidate both the admin order page and the referrals dashboard
    // Use a dynamic import to avoid the revalidation during render
    try {
      const { revalidatePath } = await import('next/cache')
      revalidatePath('/dashboard/referrals')
      revalidatePath(`/admin/orders/${referralId}`)
    } catch (revalidateError) {
      console.error('Error revalidating paths:', revalidateError)
    }
    
    return {
      success: true,
      message: 'Referral completed successfully',
      referralId: Number(referralId),
    };
  } catch (error) {
    console.error('Error in completeReferralAction:', error);
    return {
      success: false,
      message: 'Failed to complete referral',
    };
  }
}

/**
 * Server action to get a user's referral statistics
 */
export async function getReferralStatsAction(userId: string) {
  try {
    console.log('Fetching referral stats for user ID:', userId)
    
    const payload = await getPayload({ config: configPromise })
    
    // Get all referrals by this user
    const referrals = await payload.find({
      collection: 'referrals',
      where: {
        referrer: {
          equals: userId,
        },
      },
    });

    console.log('Found referrals:', {
      total: referrals.totalDocs,
      referrals: referrals.docs.map((ref: any) => ({
        id: ref.id,
        status: ref.status,
        createdAt: ref.createdAt,
      })),
    });

    const totalReferrals = referrals.totalDocs;
    const completedReferrals = referrals.docs.filter(
      (ref: any) => ref.status === 'completed'
    ).length;
    const pendingReferrals = totalReferrals - completedReferrals;
    
    // Calculate total rewards (10 points per completed referral)
    const totalRewards = completedReferrals * 10;
    
    // Get the user's current stats
    const user = await payload.findByID({
      collection: 'users',
      id: Number(userId),
    });
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    
    console.log('User stats:', {
      totalReferrals: user.totalReferrals,
      referralRewards: user.referralRewards,
      calculatedTotal: totalReferrals,
      calculatedRewards: totalRewards,
    });
    
    // Check if there's a discrepancy
    const hasDiscrepancy = user.totalReferrals !== totalReferrals || user.referralRewards !== totalRewards;
    
    if (hasDiscrepancy) {
      console.log('Discrepancy detected:', {
        storedTotal: user.totalReferrals,
        calculatedTotal: totalReferrals,
        storedRewards: user.referralRewards,
        calculatedRewards: totalRewards,
      });
    }
    
    return {
      success: true,
      stats: {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalRewards,
        userTotalReferrals: user.totalReferrals,
        userReferralRewards: user.referralRewards,
        hasDiscrepancy,
      },
    };
  } catch (error) {
    console.error('Error in getReferralStatsAction:', error);
    return {
      success: false,
      message: 'Failed to fetch referral statistics',
    };
  }
}

/**
 * Server action to sync a user's referral stats
 */
export async function syncReferralStatsAction(userId: string) {
  try {
    console.log('Syncing referral stats for user ID:', userId)
    
    const payload = await getPayload({ config: configPromise })
    
    // Get all referrals by this user
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
      (ref: any) => ref.status === 'completed'
    ).length;
    
    // Calculate total rewards
    const totalRewards = completedReferrals * 10; // Default reward amount
    
    // Update the user's stats
    const user = await payload.findByID({
      collection: 'users',
      id: Number(userId),
    });
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    
    // Only update if there's a discrepancy
    if (user.totalReferrals !== totalReferrals || user.referralRewards !== totalRewards) {
      console.log('Updating user stats:', {
        oldTotalReferrals: user.totalReferrals,
        newTotalReferrals: totalReferrals,
        oldReferralRewards: user.referralRewards,
        newReferralRewards: totalRewards
      })
      
      await payload.update({
        collection: 'users',
        id: Number(userId),
        data: {
          totalReferrals,
          referralRewards: totalRewards,
        },
      });
      
      // Use a dynamic import to avoid the revalidation during render
      try {
        const { revalidatePath } = await import('next/cache')
        revalidatePath('/dashboard/referrals')
      } catch (revalidateError) {
        console.error('Error revalidating paths:', revalidateError)
      }
      
      return {
        success: true,
        message: 'Referral stats synced successfully',
        stats: {
          totalReferrals,
          completedReferrals,
          pendingReferrals: totalReferrals - completedReferrals,
          totalRewards,
        },
      };
    } else {
      return {
        success: true,
        message: 'Referral stats are already in sync',
        stats: {
          totalReferrals,
          completedReferrals,
          pendingReferrals: totalReferrals - completedReferrals,
          totalRewards,
        },
      };
    }
  } catch (error) {
    console.error('Error in syncReferralStatsAction:', error);
    return {
      success: false,
      message: 'Failed to sync referral statistics',
    };
  }
} 