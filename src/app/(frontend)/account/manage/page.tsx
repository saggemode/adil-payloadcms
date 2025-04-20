import { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  AlertTriangle,
  Bell, 
  CreditCard, 
 
  Globe, 
  Lock, 
  Mail, 
  Shield, 
  Smartphone, 
  User,
  TabletSmartphone
} from 'lucide-react'
import Link from 'next/link'
import NameCard from './name/name-card'

export default function AccountManagePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="h1-bold">Account Management</h1>
        <p className="text-muted-foreground">Manage your account security, privacy, devices and preferences</p>
      </div>
      
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing" className="hidden md:block">Billing</TabsTrigger>
        </TabsList>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <NameCard />
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Authenticator App</h3>
                    <p className="text-sm text-muted-foreground">Use an authentication app to generate codes</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Not enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Email Authentication</h3>
                    <p className="text-sm text-muted-foreground">Receive authentication codes via email</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Not enabled</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <CardTitle>Security Activity</CardTitle>
              </div>
              <CardDescription>
                Monitor and manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Recent Logins</h3>
                  <p className="text-sm text-muted-foreground">See where your account has been accessed from</p>
                </div>
                <Button variant="outline" size="sm">View Activity</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Security Alerts</h3>
                  <p className="text-sm text-muted-foreground">Manage security notification preferences</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Privacy Settings</CardTitle>
              </div>
              <CardDescription>
                Control how your information is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Profile Visibility</h3>
                  <p className="text-sm text-muted-foreground">Manage who can see your profile information</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Usage</h3>
                  <p className="text-sm text-muted-foreground">Control how we use your browsing data</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Download Your Data</h3>
                  <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                </div>
                <Button variant="outline" size="sm">Request Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TabletSmartphone className="h-5 w-5 text-primary" />
                <CardTitle>Connected Devices</CardTitle>
              </div>
              <CardDescription>
                Manage devices that have access to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <div>
                    <h3 className="font-medium">Current Device</h3>
                    <p className="text-sm text-muted-foreground">Windows 10 • Chrome • Last active now</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Current</Badge>
              </div>
              
              <div className="p-4 text-center text-muted-foreground">
                <p>No other devices are currently logged in</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>
                Customize how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage email notification preferences</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Browser Notifications</h3>
                  <p className="text-sm text-muted-foreground">Get real-time notifications in your browser</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Communications</h3>
                  <p className="text-sm text-muted-foreground">Manage marketing email preferences</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Payment Methods</CardTitle>
              </div>
              <CardDescription>
                Manage your payment methods and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 text-center text-muted-foreground">
                <p>No payment methods found</p>
                <Button size="sm" variant="outline" className="mt-2">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Billing Address</CardTitle>
              </div>
              <CardDescription>
                Manage your billing address for purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center text-muted-foreground">
                <p>No billing address found</p>
                <Button size="sm" variant="outline" className="mt-2">Add Billing Address</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Manage your account security, privacy, devices and preferences.',
  openGraph: mergeOpenGraph({
    title: 'Account Management',
    url: '/account/manage',
  }),
}