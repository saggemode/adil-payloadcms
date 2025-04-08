import { CollectionConfig } from "payload"
import { updateAnalytics } from './hooks/updateAnalytics'

const ReferralAttempts: CollectionConfig = {
  slug: 'referral-attempts',
  admin: {
    useAsTitle: 'referralCode',
    defaultColumns: ['referralCode', 'attemptedBy', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'referralCode',
      type: 'text',
      required: true,
      admin: {
        description: 'The referral code that was attempted to be used',
      },
    },
    {
      name: 'attemptedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who attempted to use the referral code',
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
          label: 'Success',
          value: 'success',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
    },
    {
      name: 'failureReason',
      type: 'select',
      admin: {
        description: 'Reason for failure if the attempt was unsuccessful',
        condition: (data) => data.status === 'failed',
      },
      options: [
        {
          label: 'User Already Referred',
          value: 'already_referred',
        },
        {
          label: 'Invalid Code',
          value: 'invalid_code',
        },
        {
          label: 'Expired Code',
          value: 'expired_code',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'failureDetails',
      type: 'textarea',
      admin: {
        description: 'Additional details about the failure',
        condition: (data) => data.status === 'failed',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the user who made the attempt',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser/device information of the user',
      },
    },
  ],
  hooks: {
    afterChange: [updateAnalytics],
  },
  timestamps: true,
}

export default ReferralAttempts 