import { CollectionConfig } from 'payload'

const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Order Placed',
          value: 'order_placed',
        },
        {
          label: 'Order Confirmed',
          value: 'order_confirmed',
        },
        {
          label: 'Order Shipped',
          value: 'order_shipped',
        },
        {
          label: 'Order Delivered',
          value: 'order_delivered',
        },
        {
          label: 'Order Cancelled',
          value: 'order_cancelled',
        },
      ],
    },
    {
      name: 'orderId',
      type: 'text',
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
    },
  ],
}

export default Notifications
