import { CollectionConfig } from 'payload'

const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'items', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'notes',
          type: 'textarea',
        },
        {
          name: 'priority',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
          defaultValue: 'medium',
        },
      ],
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'notifications',
      type: 'group',
      fields: [
        {
          name: 'priceDrop',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'backInStock',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'saleAlert',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
  timestamps: true,
}

export default Wishlists 