import { admins } from '@/access/admins'

import { adminsOrOrderedBy } from './access/adminsOrOrderedBy'
import { adminsOrLoggedIn } from '@/access/adminsOrLoggedIn'
import type { CollectionConfig } from 'payload'
//import { sendInvoice } from './hooks/sendInvoice'
// import { populateOrderedBy } from './hooks/populateOrderedBy'
// import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'
// import { updateUserPurchases } from './hooks/updateUserPurchases'
// import { clearUserCart,  } from './hooks/clearUserCart'
// import { updateProductStock } from './hooks/updateProductStock'
// import { sendOrderConfirmationEmail } from './hooks/sendOrderConfirmationEmail'

export const Orders: CollectionConfig = {
  slug: 'orders',
  // hooks: {
  //   afterChange: [sendInvoice],
  // },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      // hooks: {
      //   beforeChange: [populateOrderedBy],
      // },
    },
    {
      name: 'coupon',
      type: 'relationship',
      relationTo: 'coupons',
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
          name: 'clientId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'countInStock',
          type: 'number',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'size',
          type: 'text',
        },
        {
          name: 'color',
          type: 'text',
        },
      ],
    },

    // shipping
    {
      name: 'address',
      type: 'relationship',
      relationTo: 'addresses',
      //required: true,
    },
    // shipping addresses
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'province',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'expectedDeliveryDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expectedDeliveryDate_tz',
      type: 'text',
      required: false,
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: true,
    },
    {
      name: 'paymentResult',
      type: 'group',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'status',
          type: 'text',
        },
        {
          name: 'email_address',
          type: 'text',
        },
        {
          name: 'pricePaid', // ADD THIS FIELD
          type: 'text',
        },
      ],
    },
    {
      name: 'itemsPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'shippingPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'taxPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'isPaid',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'paidAt',
      type: 'date',
      timezone: true,
    },
    {
      name: 'isDelivered',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'deliveredAt',
      type: 'date',
      timezone: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      timezone: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'invoiceDelivery',
      type: 'group',
      fields: [
        {
          name: 'preferences',
          type: 'group',
          fields: [
            {
              name: 'sendEmail',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'sendWhatsApp',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'sendSMS',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'status',
          type: 'group',
          fields: [
            {
              name: 'emailSent',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'whatsappSent',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'smsSent',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'lastSentAt',
              type: 'date',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
