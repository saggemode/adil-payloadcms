import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Header } from '@/payload-types'
import { getAllCategories } from '@/actions/productAction'

interface HeaderProps {
  className?: string
}

export async function Header({ className }: HeaderProps) {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const categories = await getAllCategories()
  
  return <HeaderClient data={headerData} categories={categories} className={className} />
}
