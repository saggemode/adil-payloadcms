'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/providers/Auth'

import { Copy } from 'lucide-react'


export default function ReferralCodeDisplay() {
  const { user } = useAuth()

  const copyToClipboard = async () => {
    if (user?.referralCode) {
      await navigator.clipboard.writeText(user.referralCode)
      toast({
        title: 'Referral code copied!',
        description: `Code "${user.referralCode}" has been copied to your clipboard`,
      })
    }
  }

  if (!user?.referralCode) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your Referral Code</h2>
            <p className="text-muted-foreground">
              Share this code with friends and earn rewards!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <code className="text-lg font-mono bg-muted px-4 py-2 rounded">
              {user.referralCode}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title="Copy referral code"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 