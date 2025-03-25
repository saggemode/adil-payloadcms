import { CollectionConfig } from 'payload'

export const SocialMedia: CollectionConfig = {
  slug: 'social-media',
  admin: {
    useAsTitle: 'platform',
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Facebook',
          value: 'facebook',
        },
        {
          label: 'Twitter',
          value: 'twitter',
        },
        {
          label: 'Instagram',
          value: 'instagram',
        },
        {
          label: 'Pinterest',
          value: 'pinterest',
        },
        {
          label: 'LinkedIn',
          value: 'linkedin',
        },
        {
          label: 'WhatsApp',
          value: 'whatsapp',
        },
      ],
    },
    {
      name: 'isEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Platform',
    },
    {
      name: 'appId',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'facebook',
      },
    },
    {
      name: 'appSecret',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'facebook',
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'twitter',
      },
    },
    {
      name: 'apiSecret',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'twitter',
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'instagram',
      },
    },
    {
      name: 'pinterestAccessToken',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'pinterest',
      },
    },
    {
      name: 'clientId',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'linkedin',
      },
    },
    {
      name: 'clientSecret',
      type: 'text',
      admin: {
        condition: (data) => data.platform === 'linkedin',
      },
    },
    {
      name: 'sharingPreferences',
      type: 'group',
      fields: [
        {
          name: 'shareProducts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Product Sharing',
        },
        {
          name: 'shareBlogPosts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Blog Post Sharing',
        },
        {
          name: 'shareFlashSales',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Flash Sale Sharing',
        },
      ],
    },
    {
      name: 'defaultShareMessage',
      type: 'textarea',
      defaultValue: 'Check out this amazing product!',
    },
  ],
  timestamps: true,
}
