'use client'

import React, { useEffect, useState } from 'react'
import {  Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createShareButtons, getEnabledPlatforms } from '@/utilities/socialShare'
import { FaPinterest, FaFacebook, FaTwitter,FaLinkedin } from 'react-icons/fa'

interface SocialShareProps {
  title: string
  description: string
  url: string
  image?: string
  type: 'product' | 'blog' | 'flashSale'
  className?: string
}

const platformIcons = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  pinterest: FaPinterest,
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  url,
  image,
  type,
  className,
}) => {
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>([])
  const [shareButtons, setShareButtons] = useState<
    Array<{ platform: string; onClick: () => void }>
  >([])

  useEffect(() => {
    const loadEnabledPlatforms = async () => {
      const platforms = await getEnabledPlatforms(type)
      setEnabledPlatforms(platforms.map((p) => p.platform))
    }
    loadEnabledPlatforms()
  }, [type])

  useEffect(() => {
    const buttons = createShareButtons({ title, description, url, image, type })
    setShareButtons(buttons)
  }, [title, description, url, image, type])

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {shareButtons
            .filter((button) => enabledPlatforms.includes(button.platform))
            .map((button) => {
              const Icon = platformIcons[button.platform as keyof typeof platformIcons]
              return (
                <DropdownMenuItem key={button.platform} onClick={button.onClick}>
                  <Icon className="mr-2 h-4 w-4" />
                  {button.platform.charAt(0).toUpperCase() + button.platform.slice(1)}
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
