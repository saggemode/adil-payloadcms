'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import CompareBar with ssr: false in a client component
const CompareBar = dynamic(() => import('@/components/CompareBar'), { ssr: false })

export default function ClientCompareBar() {
  return <CompareBar />
} 