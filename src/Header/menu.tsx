import CartButton from './cart-button'
import { EllipsisVertical } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import UserButton from './user-button'
import Hdata from './data'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

export default function Menu({ forAdmin = false }: { forAdmin?: boolean }) {
  return (
    <div className="flex justify-end">
      {/* Show on medium screens and larger */}
      <nav className="hidden md:flex gap-3 w-full items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 w-[400px]">
                  <div className="grid grid-cols-2 gap-3">
                    {Hdata.headerMenus.map((item) => {
                      const Icon = item.icon as LucideIcon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center p-2 space-x-2 rounded-md hover:bg-muted"
                        >
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-3 ml-auto">
          <UserButton />
          {!forAdmin && <CartButton />}
        </div>
      </nav>

      {/* Show on small screens but hide only on medium screens */}
      <nav className="flex md:hidden gap-3 w-full items-center justify-end">
        {!forAdmin && <CartButton />}
      </nav>

      {/* Mobile drawer menu */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="header-button">
              <EllipsisVertical className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader className="w-full">
              <div className="flex items-center justify-between">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription />
              </div>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              {/* Also add menu items to mobile menu */}
              <div className="space-y-3">
                {Hdata.headerMenus.map((item) => {
                  const Icon = item.icon as LucideIcon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center p-2 space-x-2 rounded-md hover:bg-muted"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="text-sm font-medium">{item.name}</div>
                    </Link>
                  );
                })}
              </div>
              <div className="border-t pt-4">
                <UserButton />
                {!forAdmin && <CartButton />}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
