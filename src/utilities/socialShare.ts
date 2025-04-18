import { getPayload } from 'payload'
import configPromise from '@payload-config'

interface ShareContent {
  title: string
  description: string
  url: string
  image?: string
  type: 'product' | 'blog' | 'flashSale'
}

interface SharingPreferences {
  shareProducts?: boolean
  shareBlogPosts?: boolean
  shareFlashSales?: boolean
}

interface SocialMediaConfig {
  platform: string
  isEnabled: boolean
  sharingPreferences: SharingPreferences
}

export async function getSocialMediaConfig(): Promise<SocialMediaConfig[]> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'social-media',
    where: {
      isEnabled: {
        equals: true,
      },
    },
  })
  return docs as SocialMediaConfig[]
}

export function generateShareUrl(platform: string, content: ShareContent): string {
  const { title, description, url, image } = content
  const encodedTitle = encodeURIComponent(title)
  //const encodedDescription = encodeURIComponent(description)
  const encodedUrl = encodeURIComponent(url)
  const encodedImage = image ? encodeURIComponent(image) : ''

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    default:
      return ''
  }
}

export async function shareToSocialMedia(platform: string, content: ShareContent) {
  const shareUrl = generateShareUrl(platform, content)
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

export function createShareButtons(content: ShareContent) {
  const platforms = ['facebook', 'twitter', 'linkedin', 'pinterest', 'whatsapp']
  return platforms.map((platform) => ({
    platform,
    onClick: () => shareToSocialMedia(platform, content),
  }))
}

export async function getEnabledPlatforms(contentType: 'product' | 'blog' | 'flashSale') {
  const configs = await getSocialMediaConfig()
  return configs.filter((config) => {
    const preferences = config.sharingPreferences || {}
    const key =
      `share${contentType.charAt(0).toUpperCase() + contentType.slice(1)}s` as keyof SharingPreferences
    return preferences[key]
  })
}
