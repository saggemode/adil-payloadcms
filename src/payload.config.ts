import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { FlashSales } from './collections/FlashSales'
import { InvoiceTemplates } from './collections/InvoiceTemplates'

import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Brands } from './collections/Brands'
import { Sizes } from './collections/Sizes'
import { Colors } from './collections/Colors'
import { Tags } from './collections/Tags'
import { Orders } from './collections/Orders'
import { Products } from './collections/Products'
import { Reviews } from './collections/Review'
import { Addresses } from './collections/Addresses'
import { Coupons } from './collections/Coupons'
import LoyaltyPoints from './collections/LoyaltyPoints'
import Rewards from './collections/Rewards'
import { PaymentMethods } from './collections/PaymentMethods'
import { SocialMedia } from './collections/SocialMedia'
import Referrals from './collections/Referrals'
import ReferralAttempts from './collections/ReferralAttempts'
import ReferralAnalytics from './collections/ReferralAnalytics'
import ReferralRewards from './collections/ReferralRewards'
import { Returns } from './collections/Returns'

// Import our barcode lookup endpoint
import { barcodeLookup } from './endpoints/api/barcode-lookup'
import { generateBarcodes } from './endpoints/api/generate-barcodes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
    
      
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],

      
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },

    timezones: {
      supportedTimezones: ({ defaultTimezones }) => {
        // Check if 'Africa/Lagos' is already in defaultTimezones
        const hasLagos = defaultTimezones.some((tz) => tz.value === 'Africa/Lagos')
        return hasLagos
          ? defaultTimezones
          : [...defaultTimezones, { label: '(GMT+1) Lagos, Nigeria', value: 'Africa/Lagos' }]
      },
      defaultTimezone: 'Africa/Lagos',
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,

  endpoints: [
    barcodeLookup,
    generateBarcodes,
  ],

  // db: sqliteAdapter({
  //   client: {
  //     url: process.env.DATABASE_URI || '',
  //   },
  // }),

  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),

  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Brands,
    Sizes,
    Colors,
    Tags,
    Orders,
    Products,
    Reviews,
    Addresses,
    Coupons,
    FlashSales,
    PaymentMethods,
    SocialMedia,
    LoyaltyPoints,
    Rewards,
    Referrals,
    ReferralAttempts,
    ReferralAnalytics,
    ReferralRewards,
    InvoiceTemplates,
    Returns,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder

    vercelBlobStorage({
      enabled: true,

      collections: {
        media: true,
      },

      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
