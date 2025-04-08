import { CollectionConfig } from "payload"

const ReferralAnalytics: CollectionConfig = {
  slug: 'referral-analytics',
  admin: {
    useAsTitle: 'referralCode',
    defaultColumns: ['referralCode', 'totalAttempts', 'successRate', 'totalPointsAwarded', 'lastUpdated'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'referralCode',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The referral code being analyzed',
      },
    },
    {
      name: 'referrer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who owns this referral code',
      },
    },
    {
      name: 'totalAttempts',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Total number of times this code was attempted to be used',
      },
    },
    {
      name: 'successfulAttempts',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Number of successful referrals using this code',
      },
    },
    {
      name: 'failedAttempts',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Number of failed attempts using this code',
      },
    },
    {
      name: 'successRate',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Percentage of successful attempts (0-100)',
      },
    },
    {
      name: 'totalPointsAwarded',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Total loyalty points awarded through this code',
      },
    },
    {
      name: 'averagePurchaseAmount',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Average purchase amount from referred users',
      },
    },
    {
      name: 'totalPurchaseAmount',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Total purchase amount from all referred users',
      },
    },
    {
      name: 'failureBreakdown',
      type: 'group',
      fields: [
        {
          name: 'alreadyReferred',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'invalidCode',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'expiredCode',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'other',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'geographicData',
      type: 'group',
      fields: [
        {
          name: 'countries',
          type: 'json',
          admin: {
            description: 'Map of country codes to attempt counts',
          },
        },
        {
          name: 'cities',
          type: 'json',
          admin: {
            description: 'Map of city names to attempt counts',
          },
        },
      ],
    },
    {
      name: 'deviceData',
      type: 'group',
      fields: [
        {
          name: 'browsers',
          type: 'json',
          admin: {
            description: 'Map of browser names to attempt counts',
          },
        },
        {
          name: 'operatingSystems',
          type: 'json',
          admin: {
            description: 'Map of OS names to attempt counts',
          },
        },
        {
          name: 'devices',
          type: 'json',
          admin: {
            description: 'Map of device types to attempt counts',
          },
        },
      ],
    },
    {
      name: 'timeData',
      type: 'group',
      fields: [
        {
          name: 'hourlyDistribution',
          type: 'json',
          admin: {
            description: 'Map of hours (0-23) to attempt counts',
          },
        },
        {
          name: 'dailyDistribution',
          type: 'json',
          admin: {
            description: 'Map of days (0-6) to attempt counts',
          },
        },
      ],
    },
    {
      name: 'lastUpdated',
      type: 'date',
      required: true,
      admin: {
        description: 'When this analytics record was last updated',
      },
    },
  ],
  timestamps: true,
}

export default ReferralAnalytics 