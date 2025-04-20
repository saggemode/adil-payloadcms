'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Pencil, Mail, Lock, ChevronRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const PAGE_TITLE = 'Login & Security'

export default function NameCard() {
  const { user } = useAuth()
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  return (
    <div className="mb-24">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/account" className="hover:text-primary transition-colors">
          Your Account
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{PAGE_TITLE}</span>
      </div>
      
      <h1 className="h1-bold py-4">{PAGE_TITLE}</h1>
      
      <Card className="max-w-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name ? getInitials(user.name) : <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account information and password
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4 mt-4">
          <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg group hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Name</h3>
                <p className="text-sm text-muted-foreground">{user?.name || 'Not set'}</p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/account/manage/name">
                    <Button variant="ghost" size="sm" className="rounded-full group-hover:bg-background gap-1">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit your display name</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg group hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Email</h3>
                  <Badge variant="outline" className="text-[10px] py-0">Primary</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user?.email || 'Not set'}</p>
              </div>
            </div>
            <Button disabled className="rounded-full gap-1" variant="ghost" size="sm">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </div>

          <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg group hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Last changed: Never</p>
                <p className="text-xs text-muted-foreground italic mt-1">Will be implemented in the next version</p>
              </div>
            </div>
            <Button disabled className="rounded-full gap-1" variant="ghost" size="sm">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
