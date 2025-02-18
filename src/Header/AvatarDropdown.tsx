'use client'

import { Popover, Transition, PopoverButton, PopoverPanel } from '@/components/headlessui'
import { Fragment } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clipboard, Heart, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'

export default function AvatarDropdown() {
  const { user } = useAuth()
  return (
    <div className="AvatarDropdown ">
      <Popover className="relative">
        {({ close }) => (
          <>
            <PopoverButton
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <User className="w-6 h-6" />
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                    <div className="flex items-center space-x-3">
                      {/* <Avatar imgUrl={avatarImgs[7]} sizeClass="w-12 h-12" /> */}
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          //src={user?.image ?? ''}
                          alt={user?.name ?? ''}
                        />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{user?.name}</h4>
                        <p className="text-xs mt-0.5">{user?.email}</p>
                      </div>
                    </div>

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                    {/* ------------------ 1 --------------------- */}
                    <Link
                      prefetch={true}
                      href={'/user/profile'}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{'My Account'}</p>
                      </div>
                    </Link>

                    {/* ------------------ 2 --------------------- */}
                    <Link
                      prefetch={true}
                      href={'/user/order'}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <Clipboard className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{'My Order'}</p>
                      </div>
                    </Link>

                    {/* ------------------ 2 --------------------- */}
                    <Link
                      prefetch={true}
                      href={'/account-savelists'}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{'Wishlist'}</p>
                      </div>
                    </Link>

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                    {/* ------------------ 2 --------------------- */}
                    <Link
                      prefetch={true}
                      href={'/'}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <Settings className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{'Help'}</p>
                      </div>
                    </Link>

                    {/* ------------------ 2 --------------------- */}
                    <Link
                      prefetch={true}
                      href={'/'}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      // onClick={() => signOut()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <LogOut className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{'Log out'}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
