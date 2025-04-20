import { admins } from '@/access/admins'
import { adminsOrOrderedBy } from '../Orders/access/adminsOrOrderedBy'
import type { CollectionConfig } from 'payload'

export const Returns: CollectionConfig = {
  slug: 'returns',
  admin: {
    useAsTitle: 'returnId',
    defaultColumns: ['returnId', 'order', 'status', 'requestDate', 'isRefundProcessed'],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrOrderedBy,
    delete: admins,
  },
  fields: [
    {
      name: 'returnId',
      type: 'text',
      admin: {
        description: 'Auto-generated return ID',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ siblingData }) => {
            if (!siblingData.returnId) {
              // Generate a random return ID (RET-XXXXX format)
              const randomId = Math.floor(10000 + Math.random() * 90000)
              return `RET-${randomId}`
            }
            return siblingData.returnId
          },
        ],
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      hasMany: false,
      admin: {
        description: 'The order associated with this return',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Items Received', value: 'received' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'requestDate',
      type: 'date',
      admin: {
        description: 'Date the return was requested',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        description: 'Items being returned',
      },
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
          required: true,
          min: 1,
        },
        {
          name: 'reason',
          type: 'select',
          required: true,
          options: [
            { label: 'Damaged/Defective', value: 'damaged' },
            { label: 'Wrong Item', value: 'wrong_item' },
            { label: 'Not as Described', value: 'not_as_described' },
            { label: 'Changed Mind', value: 'changed_mind' },
            { label: 'Sizing Issue', value: 'sizing_issue' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'reasonDetails',
          type: 'textarea',
          admin: {
            description: 'Additional details about the return reason',
          },
        },
        {
          name: 'condition',
          type: 'select',
          options: [
            { label: 'New/Unused', value: 'new' },
            { label: 'Used', value: 'used' },
            { label: 'Damaged', value: 'damaged' },
          ],
        },
      ],
    },
    {
      name: 'returnMethod',
      type: 'select',
      options: [
        { label: 'Drop-off at Store', value: 'store_dropoff' },
        { label: 'Mail Return', value: 'mail' },
        { label: 'Pickup Service', value: 'pickup' },
      ],
    },
    {
      name: 'refundType',
      type: 'select',
      options: [
        { label: 'Full Refund', value: 'full_refund' },
        { label: 'Partial Refund', value: 'partial_refund' },
        { label: 'Store Credit', value: 'store_credit' },
        { label: 'Replacement', value: 'replacement' },
        { label: 'No Refund', value: 'no_refund' },
      ],
      defaultValue: 'full_refund',
    },
    {
      name: 'refundAmount',
      type: 'number',
      admin: {
        description: 'Amount to be refunded (if applicable)',
      },
    },
    {
      name: 'isRefundProcessed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the refund has been processed',
      },
    },
    {
      name: 'refundProcessedDate',
      type: 'date',
      admin: {
        description: 'Date the refund was processed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for administrators',
      },
    },
    {
      name: 'customerMessages',
      type: 'array',
      fields: [
        {
          name: 'message',
          type: 'textarea',
          required: true,
        },
        {
          name: 'sentBy',
          type: 'select',
          options: [
            { label: 'Customer', value: 'customer' },
            { label: 'Admin', value: 'admin' },
          ],
          required: true,
        },
        {
          name: 'sentAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'returnShippingLabel',
      type: 'text',
      admin: {
        description: 'Tracking number or link to return shipping label',
      },
    },
    {
      name: 'returnShippingCarrier',
      type: 'text',
      admin: {
        description: 'The carrier handling the return shipment',
      },
    },
    {
      name: 'returnTrackingNumber',
      type: 'text',
      admin: {
        description: 'Tracking number for the return shipment',
      },
    },
    {
      name: 'returnReceiptImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
      admin: {
        description: 'Images of returned items or return receipts',
      },
    },
  ],
} 