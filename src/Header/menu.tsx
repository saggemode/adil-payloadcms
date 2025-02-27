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

import UserButton from './user-button'

export default function Menu({ forAdmin = false }: { forAdmin?: boolean }) {
  return (
    <div className="flex justify-end">
      {/* Show on medium screens and larger */}
      <nav className="hidden md:flex gap-3 w-full items-center">
       
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>

      {/* Show on small screens but hide only on medium screens */}
      <nav className="flex md:hidden gap-3 w-full items-center">{!forAdmin && <CartButton />}</nav>

      {/* Mobile drawer menu */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle header-button">
            <EllipsisVertical className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="bg-black text-white flex flex-col items-start">
            <SheetHeader className="w-full">
              <div className="flex items-center justify-between">
                <SheetTitle>Site Menu</SheetTitle>
                <SheetDescription />
              </div>
            </SheetHeader>
           
            <UserButton />
            {!forAdmin && <CartButton />}
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
