
import {  buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/providers/Auth'
//import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/utilities/ui'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default  function UserButton() {
  const { user } = useAuth()
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="header-button" asChild>
          <div className="flex items-center">
            <div className="flex flex-col text-xs text-left">
              <span>Hello, {user ? user.name : 'sign in'}</span>
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
              <Link className="w-full" href="/account">
                <DropdownMenuItem>Your account</DropdownMenuItem>
              </Link>
              <Link className="w-full" href="/account/orders">
                <DropdownMenuItem>Your orders</DropdownMenuItem>
              </Link>

              {user.roles?.includes('admin') && (
                <Link className="w-full" href="/admin">
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}

              {/* {Array.isArray(user.roles) && user.roles.includes('admin') && (
                <Link className="w-full" href="/admin">
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )} */}
            </DropdownMenuGroup>
            {/* <DropdownMenuItem className="p-0 mb-1">
              <form action={logout} className="w-full">
                <Button className="w-full py-4 px-2 h-4 justify-start" variant="ghost">
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem> */}
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
