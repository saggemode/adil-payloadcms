import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/ui'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function UserButton() {
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="header-button" asChild>
          <div className="flex items-center">
            <div className="flex flex-col text-xs text-left">
              <span>
                {getGreeting()}, {user ? user.name : 'sign in'}
              </span>
              <span className="font-bold">Account & Orders</span>
            </div>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        {user ? (
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link className="w-full" href="/account" prefetch={true}>
                <DropdownMenuItem>Your account</DropdownMenuItem>
              </Link>
              <Link className="w-full" href="/account/orders" prefetch={true}>
                <DropdownMenuItem>Your orders</DropdownMenuItem>
              </Link>
              <Link className="w-full" href="/account/wishlist" prefetch={true}>
                <DropdownMenuItem>Your wishlist</DropdownMenuItem>
              </Link>

              {user.roles?.includes('admin') && (
                <Link className="w-full" href="/admin" prefetch={true}>
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}

              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link 
                  className={cn(
                    buttonVariants(), 
                    'w-full',
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )} 
                  href="/auth/login"
                >
                  {isLoading ? 'Loading...' : 'Sign in'}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="font-normal">
                New Customer?{' '}
                <Link 
                  className={isLoading ? 'opacity-50 cursor-not-allowed' : ''} 
                  href="/auth/register"
                >
                  Sign up
                </Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
