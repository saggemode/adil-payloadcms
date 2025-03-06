import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons', // Collection slug
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'code', // Unique coupon code
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'discountPercent', // Discount percentage
      type: 'number',
      required: true,
    },
    {
      name: 'startDate', // Start date of the coupon validity
      type: 'date',
      required: true,
      timezone: true,
    },
    {
      name: 'endDate', // End date of the coupon validity
      type: 'date',
      required: true,
      timezone: true,
    },
    {
      name: 'usageLimit', // Maximum number of times the coupon can be used
      type: 'number',
      required: true,
    },
    {
      name: 'usageCount', // Number of times the coupon has been used
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders', // Ensure this matches the slug of your Orders collection
      hasMany: true, // Allow multiple orders to be associated with a coupon
    },
    ...slugField(),
  ],
}
