// auth.ts
import payloadConfig from '@payload-config'
import { authConfig } from 'auth.config'
import NextAuth from 'next-auth'
import { withPayload } from 'payload-authjs'

export const { handlers, signIn, signOut, auth } = NextAuth(
  withPayload(authConfig, {
    payloadConfig,
  }),
)
