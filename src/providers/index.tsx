import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './Auth'
import { FilterProvider } from './Filter'
import ClientProviders from './ClientProvider/client-providers'
import QueryProvider from './QueryProvider/QueryProvider'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { CompareProvider } from '@/contexts/CompareContext'
//import { NotificationCenter } from '@/components/notifications/NotificationCenter'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <FilterProvider>
            <HeaderThemeProvider>
              <ClientProviders>
                <NotificationProvider>
                  <CompareProvider>
                    {children}
                    {/* <NotificationCenter /> */}
                  </CompareProvider>
                </NotificationProvider>
              </ClientProviders>
            </HeaderThemeProvider>
          </FilterProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
