import { anyone } from '@/access/anyone'
import { admins } from '@/access/admins'
import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

import { validateDatesAndStatus, updateProductAvailability } from './hooks'

export const FlashSales: CollectionConfig = {
  slug: 'flash-sales',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'startDate', 'endDate', 'discountPercent', 'status'],
    group: 'Shop',
  },
  access: {
    create: admins,
    read: anyone,
    update: admins,
    delete: admins,
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
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'discountPercent',
      type: 'number',
      required: true,
      min: 1,
      max: 99,
      admin: {
        description: 'Percentage discount to apply to products',
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      filterOptions: ({ data }) => {
        return {
          countInStock: {
            greater_than: 0,
          },
        }
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Scheduled',
          value: 'scheduled',
        },
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'minimumPurchase',
      type: 'number',
      min: 0,
      admin: {
        description:
          'Minimum purchase amount required to qualify for the flash sale (0 for no minimum)',
      },
    },
    {
      name: 'itemLimit',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Maximum number of items each customer can buy (0 for unlimited)',
      },
    },
    {
      name: 'totalQuantity',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Total number of items available for this flash sale',
      },
    },
    {
      name: 'soldQuantity',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of items sold in this flash sale',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this flash sale on the homepage',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher priority flash sales will be shown first',
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [validateDatesAndStatus],
    afterChange: [updateProductAvailability],
  },
}
