'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Check, Mail } from 'lucide-react'

export default function EmailRecommendations() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      toast.success('You&apos;ve been subscribed to personalized recommendations!')
    }, 1500)
    
    // In a real implementation, you would call an API endpoint to save the email
    // try {
    //   const response = await fetch('/api/recommendations/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   })
    //   
    //   if (!response.ok) throw new Error('Failed to subscribe')
    //   
    //   setIsSubmitting(false)
    //   setIsSubscribed(true)
    //   toast.success('You&apos;ve been subscribed to personalized recommendations!')
    // } catch (error) {
    //   setIsSubmitting(false)
    //   toast.error('Failed to subscribe. Please try again.')
    // }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          Get product recommendations tailored to your interests delivered to your inbox
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-center text-sm text-gray-600">
              Thanks for subscribing! You&apos;ll start receiving personalized recommendations soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500">
          We&apos;ll never share your email with anyone else. You can unsubscribe at any time.
        </p>
      </CardFooter>
    </Card>
  )
} 