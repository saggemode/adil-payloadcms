import { User as PayloadUser } from 'payload'

export interface User extends PayloadUser {
  loyalty_points?: number
  referralCode?: string
  addresses?: number[]
  name?: string
  roles?: string[]
  stripeCustomerID?: string
  skipSync?: boolean
} 