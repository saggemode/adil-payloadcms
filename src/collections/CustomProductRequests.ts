import { CollectionConfig } from 'payload/types'

const CustomProductRequests: CollectionConfig = {
  slug: 'custom-product-requests',
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName', 'customerName', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Customer Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Product Description',
    },
    {
      name: 'preferredPrice',
      type: 'number',
      label: 'Preferred Price Range',
    },
    {
      name: 'quantity',
      type: 'number',
      label: 'Desired Quantity',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'In Review',
          value: 'in-review',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Reference Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Image Caption',
        },
      ],
    },
  ],
  timestamps: true,
}

export default CustomProductRequests
