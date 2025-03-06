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

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function UserButton() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
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
                <Link className={cn(buttonVariants(), 'w-full')} href="/auth/login">
                  Sign in
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="font-normal">
                New Customer? <Link href="/auth/register">Sign up</Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
