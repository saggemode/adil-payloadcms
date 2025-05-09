import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { useAuth } from '@/providers/Auth'

interface SidebarProps {
  categories: { id: string; title: string }[]
}

export default function Sidebar({ categories }: SidebarProps) {
  const { user } = useAuth()

  return (
    <Drawer direction="left">
      <DrawerTrigger className="header-button flex items-center !p-2  ">
        <MenuIcon className="h-5 w-5 mr-1" />
        All
      </DrawerTrigger>
      <DrawerContent className="w-[350px] mt-0 top-0">
        <div className="flex flex-col h-full">
          {/* User Sign In Section */}
          <div className="dark bg-gray-800 text-foreground flex items-center justify-between  ">
            <DrawerHeader>
              <DrawerTitle className="flex items-center">
                <UserCircle className="h-6 w-6 mr-2" />
                {user ? (
                  <DrawerClose asChild>
                    <Link href="/account">
                      <span className="text-lg font-semibold">Hello, {user.name}</span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/sign-in">
                      <span className="text-lg font-semibold">Hello, sign in</span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>

          {/* Shop By Category */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Shop By Department</h2>
            </div>
            <nav className="flex flex-col">
              {categories.map((category) => (
                <DrawerClose asChild key={category.id}>
                  <Link
                    href={`/products?category=${category.title}`}
                    className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
                  >
                    <span>{category.title}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* Setting and Help */}
          <div className="border-t flex flex-col ">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Help & Settings</h2>
            </div>
            <DrawerClose asChild>
              <Link href="/account" className="p-4 hover:bg-muted transition-colors flex items-center">
                Your account
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href="/account/orders" className="p-4 hover:bg-muted transition-colors flex items-center">
                Your orders
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href="/account/settings" className="p-4 hover:bg-muted transition-colors flex items-center">
                Settings
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href="/page/customer-service" className="p-4 hover:bg-muted transition-colors flex items-center">
                Customer Service
              </Link>
            </DrawerClose>
            {user ? (
              <form action={'SignOut'} className="w-full">
                <Button className="w-full justify-start p-4 text-base font-normal h-auto" variant="ghost">
                  Sign out
                </Button>
              </form>
            ) : (
              <Link href="/sign-in" className="p-4 hover:bg-muted transition-colors flex items-center">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
