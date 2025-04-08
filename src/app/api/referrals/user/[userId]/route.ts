import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    
    if (!userId) {
      console.error('User ID is missing in request')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Fetching referral for user ID:', userId)
    
    const payload = await getPayload({ config: configPromise })
    
    // Find the referral for this user
    const referrals = await payload.find({
      collection: 'referrals',
      where: {
        referredUser: {
          equals: Number(userId),
        },
      },
      limit: 1,
    })
    
    console.log('Referral search results:', {
      totalDocs: referrals.totalDocs,
      docs: referrals.docs.map(doc => ({
        id: doc.id,
        status: doc.status,
        referrer: doc.referrer,
        referredUser: doc.referredUser
      }))
    })
    
    if (!referrals.docs || referrals.docs.length === 0) {
      console.log('No referral found for user ID:', userId)
      return NextResponse.json(
        { referral: null },
        { status: 200 }
      )
    }
    
    const referral = referrals.docs[0]
    if (referral) {
      console.log('Found referral:', {
        id: referral.id,
        status: referral.status,
        referrer: referral.referrer,
        referredUser: referral.referredUser
      })
    }
    
    return NextResponse.json(
      { referral },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching referral:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    )
  }
} 