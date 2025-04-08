import { CollectionConfig } from "payload"
import { updateStock } from './hooks/updateStock'

const Rewards: CollectionConfig = {
  slug: 'rewards',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'pointsCost',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Discount',
          value: 'discount',
        },
        {
          label: 'Free Shipping',
          value: 'free_shipping',
        },
        {
          label: 'Free Product',
          value: 'free_product',
        },
        {
          label: 'Special Access',
          value: 'special_access',
        },
      ],
    },
    {
      name: 'discountAmount',
      type: 'number',
      admin: {
        condition: (data) => data.type === 'discount',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      options: [
        {
          label: 'Percentage',
          value: 'percentage',
        },
        {
          label: 'Fixed Amount',
          value: 'fixed',
        },
      ],
      admin: {
        condition: (data) => data.type === 'discount',
      },
    },
    {
      name: 'freeProduct',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        condition: (data) => data.type === 'free_product',
      },
    },
    {
      name: 'specialAccessDetails',
      type: 'textarea',
      admin: {
        condition: (data) => data.type === 'special_access',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      required: true,
    },
    {
      name: 'validUntil',
      type: 'date',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'linkedProduct',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'The product whose stock will be used for this reward',
      },
    },
    {
      name: 'stock',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'This field is automatically updated based on the linked product\'s stock',
      },
    },
    {
      name: 'tierRestrictions',
      type: 'select',
      hasMany: true,
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [updateStock],
  },
}

export default Rewards
