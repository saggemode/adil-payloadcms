import { CollectionConfig } from "payload"
import { handleReferral } from './hooks/handleReferral'

const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
    useAsTitle: 'referralCode',
    defaultColumns: ['referrer', 'referredUser', 'status', 'rewardTier', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'referrer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who made the referral',
      },
    },
    {
      name: 'referredUser',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who was referred',
      },
    },
    {
      name: 'referralCode',
      type: 'text',
      required: true,
      admin: {
        description: 'The referral code used (from the referrer)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Expired',
          value: 'expired',
        },
      ],
    },
    {
      name: 'rewardTier',
      type: 'relationship',
      relationTo: 'referral-rewards',
      required: true,
      admin: {
        description: 'The reward tier assigned to this referral',
      },
    },
    {
      name: 'purchaseAmount',
      type: 'number',
      min: 0,
      admin: {
        description: 'Amount spent by the referred user',
        condition: (data) => data.status === 'completed',
      },
    },
    {
      name: 'expiryDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date when the referral code expires',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'Date when the referral was completed',
        condition: (data) => data.status === 'completed',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the referral',
      },
    },
  ],
  hooks: {
    beforeChange: [handleReferral],
  },
  timestamps: true,
}

export default Referrals 