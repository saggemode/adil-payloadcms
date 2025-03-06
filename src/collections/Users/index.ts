import type { CollectionConfig } from 'payload'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { admins } from '@/access/admins'
import { checkRole } from './checkRole'
//import { CustomerSelect } from './ui/CustomerSelect'
import adminsAndUser from './access/adminsAndUser'
import { anyone } from '@/access/anyone'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    description: 'Users of the platform',
    listSearchableFields: ['email', 'name'],
  },
  auth: true,
  fields: [
    {
      name: 'addresses',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: true,
    },
    {
      name: 'name',
      type: 'text',
    },

    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
        {
          label: 'moderator',
          value: 'moderator',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
    },

    {
      name: 'stripeCustomerID',
      label: 'Stripe Customer',
      type: 'text',
      access: {
        read: ({ req: { user } }) => {
          if (!user) {
            return false // Prevent access if user is null
          }
          return checkRole(['admin'], user) // Proceed if user exists
        },
      },
      admin: {
        position: 'sidebar',
        // components: {
        //   Field: CustomerSelect,
        // },
      },
    },

    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
