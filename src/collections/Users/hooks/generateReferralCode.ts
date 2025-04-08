import { FieldHook } from 'payload'

export const generateReferralCode: FieldHook = async (args) => {
  const { value, req } = args
  
  // Only generate a code if the field is empty
  if (!value) {
    try {
      return await generateUniqueCode(req.payload)
    } catch (error) {
      console.error('Error generating referral code:', error)
      // Return a fallback code with timestamp to ensure uniqueness
      return `REF${Date.now().toString(36).toUpperCase()}`
    }
  }
  
  return value
}

// Helper function to generate a unique referral code
async function generateUniqueCode(payload: any): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLength = 8
  let attempts = 0
  const maxAttempts = 10
  
  // Keep generating until we find a unique code or hit max attempts
  while (attempts < maxAttempts) {
    attempts++
    let code = ''
    for (let i = 0; i < codeLength; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    try {
      // Check if this code already exists
      const existingUser = await payload.find({
        collection: 'users',
        where: {
          referralCode: {
            equals: code
          }
        },
        limit: 1
      })
      
      if (existingUser.totalDocs === 0) {
        return code
      }
    } catch (error) {
      console.error('Error checking for existing code:', error)
      // If we can't check, use a timestamp-based code to ensure uniqueness
      return `REF${Date.now().toString(36).toUpperCase()}`
    }
  }
  
  // If we've exhausted attempts, use a timestamp-based code
  return `REF${Date.now().toString(36).toUpperCase()}`
} 