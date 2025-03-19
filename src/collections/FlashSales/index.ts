import { CollectionConfig } from 'payload'
import { admins } from '@/access/admins'

export const FlashSales: CollectionConfig = {
  slug: 'flash-sales',
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'startDate', 'endDate', 'discountType', 'discountAmount'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Flash Sale Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
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
          label: 'Ended',
          value: 'ended',
        },
      ],
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
      validate: (
        value: Date | null | undefined,
        { data }: { data: { startDate?: Date | null | undefined } },
      ) => {
        if (value && data.startDate && value <= data.startDate) {
          return 'End date must be after start date'
        }
        return true
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
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
    },
    {
      name: 'discountAmount',
      type: 'number',
      required: true,
      validate: (
        value: number | null | undefined,
        { data }: { data: { discountType?: 'percentage' | 'fixed' } },
      ) => {
        if (!value) return true
        if (data.discountType === 'percentage' && (value <= 0 || value > 100)) {
          return 'Percentage discount must be between 0 and 100'
        }
        if (data.discountType === 'fixed' && value <= 0) {
          return 'Fixed discount must be greater than 0'
        }
        return true
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
    },
    {
      name: 'rules',
      type: 'array',
      label: 'Sale Rules',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Minimum Purchase Amount',
              value: 'minPurchase',
            },
            {
              label: 'Maximum Discount Per Order',
              value: 'maxDiscount',
            },
            {
              label: 'Limited Quantity Per Customer',
              value: 'maxQuantity',
            },
          ],
        },
        {
          name: 'value',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'totalOrders',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalRevenue',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'totalDiscount',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'averageOrderValue',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'totalQuantity',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'soldQuantity',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Update status based on dates
        const now = new Date()
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)

        if (now < startDate) {
          data.status = 'scheduled'
        } else if (now >= startDate && now <= endDate) {
          data.status = 'active'
        } else if (now > endDate) {
          data.status = 'ended'
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Update product prices when flash sale becomes active
        if (doc.status === 'active') {
          const products = await req.payload.find({
            collection: 'products',
            where: {
              id: {
                in: doc.products,
              },
            },
          })

          for (const product of products.docs) {
            const originalPrice = product.price
            let discountedPrice = originalPrice

            if (doc.discountType === 'percentage') {
              discountedPrice = originalPrice * (1 - doc.discountAmount / 100)
            } else {
              discountedPrice = originalPrice - doc.discountAmount
            }

            await req.payload.update({
              collection: 'products',
              id: product.id,
              data: {
                flashSaleId: doc.id,
                flashSaleEndDate: doc.endDate,
                flashSaleDiscount: doc.discountAmount,
                price: discountedPrice,
              },
            })
          }
        }

        // Reset product prices when flash sale ends
        if (doc.status === 'ended') {
          const products = await req.payload.find({
            collection: 'products',
            where: {
              flashSaleId: {
                equals: doc.id,
              },
            },
          })

          for (const product of products.docs) {
            await req.payload.update({
              collection: 'products',
              id: product.id,
              data: {
                flashSaleId: null,
                flashSaleEndDate: null,
                flashSaleDiscount: null,
                price: product.listPrice, // Reset to original price
              },
            })
          }
        }
      },
    ],
  },
}
