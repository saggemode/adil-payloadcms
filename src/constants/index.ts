export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Auxdoriz'
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'
export const SENDER_NAME = process.env.SENDER_NAME || APP_NAME
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || 'Spend less, enjoy more.'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'An Amazon clone built with Next.js and MongoDB'
export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT || `Copyright © 2025 ${APP_NAME}. All rights reserved.`

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)

export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)

export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: 'PayPal',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Stripe',
    commission: 0,
    isDefault: false,
  },
  {
    name: 'Cash On Delivery',
    commission: 0,
    isDefault: false,
  },
  {
    name: 'OPay',
    commission: 0,
    isDefault: false,
  },
]
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 3 Days',
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 5 Days',
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35,
  },
]

export const USER_ROLES = ['Admin', 'User']

export const REFUND_REASONS = [
  {
    label: 'Damaged/Defective',
    value: 'damaged',
    description: 'Item arrived damaged or is not functioning as expected',
  },
  {
    label: 'Wrong Item',
    value: 'wrong_item',
    description: 'Received a different item than what was ordered',
  },
  {
    label: 'Not as Described',
    value: 'not_as_described',
    description: 'Item doesn\'t match the website description or images',
  },
  {
    label: 'Changed Mind',
    value: 'changed_mind',
    description: 'No longer want the item (may be subject to restocking fee)',
  },
  {
    label: 'Sizing Issue',
    value: 'sizing_issue',
    description: 'Item doesn\'t fit as expected',
  },
  {
    label: 'Other',
    value: 'other',
    description: 'Other reason',
  },
]

export const RETURN_METHODS = [
  {
    label: 'Drop-off at Store',
    value: 'store_dropoff',
    description: 'Return the item to any of our physical stores',
  },
  {
    label: 'Mail Return',
    value: 'mail',
    description: 'Ship the item back using a provided return label',
  },
  {
    label: 'Pickup Service',
    value: 'pickup',
    description: 'Schedule a pickup from your location (additional fees may apply)',
  },
]

export const REFUND_TYPES = [
  {
    label: 'Full Refund',
    value: 'full_refund',
    description: 'Receive the full purchase amount back to original payment method',
  },
  {
    label: 'Partial Refund',
    value: 'partial_refund',
    description: 'Receive a portion of the purchase amount (for damaged or used items)',
  },
  {
    label: 'Store Credit',
    value: 'store_credit',
    description: 'Receive the refund amount as store credit for future purchases',
  },
  {
    label: 'Replacement',
    value: 'replacement',
    description: 'Receive the same product as a replacement instead of a refund',
  },
]
