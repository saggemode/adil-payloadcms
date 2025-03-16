import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'flashSale',
      type: 'group',
      fields: [
        {
          name: 'isFlashSale',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Flash Sale',
        },
        {
          name: 'flashSalePrice',
          type: 'number',
          admin: {
            condition: (data, siblingData) => siblingData?.isFlashSale,
          },
        },
        {
          name: 'startTime',
          type: 'date',
          admin: {
            condition: (data, siblingData) => siblingData?.isFlashSale,
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: {
            condition: (data, siblingData) => siblingData?.isFlashSale,
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'flashSaleStock',
          type: 'number',
          admin: {
            condition: (data, siblingData) => siblingData?.isFlashSale,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Validate flash sale dates if enabled
        if (data.flashSale?.isFlashSale) {
          const startTime = new Date(data.flashSale.startTime)
          const endTime = new Date(data.flashSale.endTime)

          if (startTime >= endTime) {
            throw new Error('Flash sale end time must be after start time')
          }

          if (data.flashSale.flashSalePrice >= data.price) {
            throw new Error('Flash sale price must be lower than regular price')
          }
        }
        return data
      },
    ],
  },
}
