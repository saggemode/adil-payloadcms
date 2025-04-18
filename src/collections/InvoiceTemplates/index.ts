import { admins } from '@/access/admins'
import type { CollectionConfig } from 'payload'

export const InvoiceTemplates: CollectionConfig = {
  slug: 'invoice-templates',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: admins,
    create: admins,
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
      type: 'text',
    },
    {
      name: 'template',
      type: 'richText',
      required: true,
      admin: {
        description: 'Use {{variable}} syntax for dynamic content. Available variables: orderId, customerName, items, totalPrice, shippingAddress, etc.',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set this as the default template for new orders',
      },
    },
  ],
} 