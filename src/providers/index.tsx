import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './Auth'
import { FilterProvider } from './Filter'
import ClientProviders from './ClientProvider/client-providers'
import QueryProvider from './QueryProvider/QueryProvider'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FilterProvider>
          <HeaderThemeProvider>
            <ClientProviders>
              <QueryProvider>
                <NotificationProvider>
                  {children}
                  {/* <NotificationCenter /> */}
                </NotificationProvider>
              </QueryProvider>
            </ClientProviders>
          </HeaderThemeProvider>
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
