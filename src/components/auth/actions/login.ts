import { LoginSchema, LoginSchemaType } from '@/schemas'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const login = async (values: LoginSchemaType, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values)

  const payload = await getPayload({ config: configPromise })

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data

  // Fetch user from Payload CMS
  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
  })

  if (!existingUser.docs.length) {
    return { error: 'Email does not exist!' }
  }

  //const user = existingUser.docs[0]

  // Authenticate user using Payload CMS login
  try {
    const loggedInUser = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    return {
      success: true,
      user: loggedInUser,
      redirectTo: callbackUrl || '/',
    }
  } catch (_error) {
    return { error: 'Invalid credentials!' }
  }
}
