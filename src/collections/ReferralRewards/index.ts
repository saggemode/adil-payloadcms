import { CollectionConfig } from "payload"

const ReferralRewards: CollectionConfig = {
  slug: 'referral-rewards',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rewardAmount', 'rewardType', 'isActive', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the reward tier (e.g., "Standard Referral", "Premium Referral")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of this reward tier',
      },
    },
    {
      name: 'rewardAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Fixed amount awarded for successful referral',
      },
    },
    {
      name: 'rewardType',
      type: 'select',
      required: true,
      defaultValue: 'fixed',
      options: [
        {
          label: 'Fixed Amount',
          value: 'fixed',
        },
        {
          label: 'Percentage',
          value: 'percentage',
        },
      ],
      admin: {
        description: 'Type of reward (fixed amount or percentage)',
      },
    },
    {
      name: 'rewardPercentage',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Percentage reward (only used if rewardType is percentage)',
        condition: (data) => data.rewardType === 'percentage',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this reward tier is currently active',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'Start date for this reward tier',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'End date for this reward tier',
      },
    },
    {
      name: 'minimumPurchaseAmount',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum purchase amount required to qualify for this reward',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this reward tier',
      },
    },
  ],
  timestamps: true,
}

export default ReferralRewards 