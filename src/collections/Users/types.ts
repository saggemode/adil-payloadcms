import { User as PayloadUser } from 'payload'

export interface User extends PayloadUser {
  loyaltyPoints?: number
  referralCode?: string
  addresses?: number[]
  name?: string
  roles?: string[]
  stripeCustomerID?: string
  skipSync?: boolean
} 