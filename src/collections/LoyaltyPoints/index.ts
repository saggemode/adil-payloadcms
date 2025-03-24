import { CollectionConfig } from "payload"


const LoyaltyPoints: CollectionConfig = {
  slug: 'loyalty-points',
  admin: {
    useAsTitle: 'customerId',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'customerId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Bronze',
          value: 'bronze',
        },
        {
          label: 'Silver',
          value: 'silver',
        },
        {
          label: 'Gold',
          value: 'gold',
        },
        {
          label: 'Platinum',
          value: 'platinum',
        },
      ],
      defaultValue: 'bronze',
    },
    {
      name: 'pointsHistory',
      type: 'array',
      fields: [
        {
          name: 'points',
          type: 'number',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Earned',
              value: 'earned',
            },
            {
              label: 'Redeemed',
              value: 'redeemed',
            },
            {
              label: 'Expired',
              value: 'expired',
            },
            {
              label: 'Adjusted',
              value: 'adjusted',
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'rewards',
      type: 'array',
      fields: [
        {
          name: 'rewardId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'pointsCost',
          type: 'number',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Available',
              value: 'available',
            },
            {
              label: 'Redeemed',
              value: 'redeemed',
            },
            {
              label: 'Expired',
              value: 'expired',
            },
          ],
        },
        {
          name: 'redeemedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'tierHistory',
      type: 'array',
      fields: [
        {
          name: 'tier',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Bronze',
              value: 'bronze',
            },
            {
              label: 'Silver',
              value: 'silver',
            },
            {
              label: 'Gold',
              value: 'gold',
            },
            {
              label: 'Platinum',
              value: 'platinum',
            },
          ],
        },
        {
          name: 'changedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'reason',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
    },
  ],
}

export default LoyaltyPoints
