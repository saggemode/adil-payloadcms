import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BrowsingHistoryList from '@/heros/ProductHero/components/browsing-history-list'
import { Bell, CreditCard, Gift, Home, Mail, PackageCheckIcon, RefreshCcw, Settings, ShoppingBag, Sparkles, Tag, User } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import LoyaltyPointsDisplay from '@/components/loyalty/LoyaltyPointsDisplay'
import ReferralCodeDisplay from '@/components/referral/ReferralCodeDisplay'
import ReferralStatsDisplay from '@/components/referral/ReferralStatsDisplay'
import { EmailRecommendations } from '@/components/Recommendations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Heart } from 'lucide-react'
import { getMyOrdersCount, getOrderDeliveryCount } from '@/actions/orderAction'
import { formatDistanceToNow } from 'date-fns'
import { getLoyaltyPointsSummary } from '@/actions/loyaltyAction'
import { getMeUser } from '@/utilities/getMeUser'

const PAGE_TITLE = 'Your Account'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function AccountPage() {
  const { user } = await getMeUser()
  const orderCount = await getMyOrdersCount()
  const orderDeliveryInfo = await getOrderDeliveryCount('12345')
  
  // Format the delivery date if it exists
  const formattedDeliveryDate = orderDeliveryInfo.latestDeliveryDate 
    ? formatDistanceToNow(new Date(orderDeliveryInfo.latestDeliveryDate), { addSuffix: true })
    : '2 days ago';
    
  // Get loyalty points summary if user is logged in
  const loyaltyInfo = user ? await getLoyaltyPointsSummary(user.id.toString()) : null
  
  // Format the loyalty points date if it exists
  const formattedLoyaltyDate = loyaltyInfo?.latestActivity
    ? formatDistanceToNow(new Date(loyaltyInfo.latestActivity), { addSuffix: true })
    : 'No recent activity';

  return (
    <div className="space-y-6 pb-10">
      {/* Account Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src="/images/placeholder-user.jpg" alt="Profile" />
            <AvatarFallback>
              <User className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="h2-bold">{PAGE_TITLE}</h1>
            <p className="text-muted-foreground">Welcome back! Manage your account and preferences</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 py-1">
            <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
            <span className="uppercase text-xs font-medium">Gold Member</span>
          </Badge>
          <Link href="/account/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Your recent activity and important information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <ShoppingBag className="h-8 w-8 mb-2 text-primary" />
                    <span className="text-xl font-bold">{orderCount}</span>
                    <span className="text-sm text-muted-foreground">Orders</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <CreditCard className="h-8 w-8 mb-2 text-green-500" />
                    <span className="text-xl font-bold">$1,243</span>
                    <span className="text-sm text-muted-foreground">Spent</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Gift className="h-8 w-8 mb-2 text-purple-500" />
                    <span className="text-xl font-bold">3</span>
                    <span className="text-sm text-muted-foreground">Rewards</span>
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-medium mb-3">Recent Activity</h3>
                  <ScrollArea className="h-[120px] w-full rounded-md">
                    <div className="space-y-3 pr-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PackageCheckIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm"> ({orderDeliveryInfo.count} total deliveries)</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formattedDeliveryDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Earned {loyaltyInfo?.lastEarnedPoints || 0} loyalty points</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formattedLoyaltyDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Subscribed to newsletters</span>
                        </div>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <LoyaltyPointsDisplay />
            </div>
          </div>
          
          {/* Referral and Recommendations Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ReferralCodeDisplay />
              <ReferralStatsDisplay />
            </div>
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-muted-foreground">Get notifications about your orders</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Price Alerts</p>
                        <p className="text-sm text-muted-foreground">Be notified when items on your wishlist drop in price</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing</p>
                        <p className="text-sm text-muted-foreground">Receive news about products and promotions</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <EmailRecommendations />
        </TabsContent>

        {/* Shopping Tab */}
        <TabsContent value="shopping" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <Link href="/account/orders">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <PackageCheckIcon className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Orders</h2>
                    <p className="text-muted-foreground">
                      Track, return, cancel an order, download invoice or buy again
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Link href="/account/returns">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <RefreshCcw className="w-12 h-12 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Returns & Refunds</h2>
                    <p className="text-muted-foreground">
                      Request returns, track refund status, and manage your return requests
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Link href="/wishlist">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <Heart className="w-12 h-12 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Wishlist</h2>
                    <p className="text-muted-foreground">
                      View saved items and add them to your cart
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Link href="/rewards">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <Gift className="w-12 h-12 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Rewards</h2>
                    <p className="text-muted-foreground">
                      View and redeem your loyalty points and special offers
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
          
          <BrowsingHistoryList className='mt-8' />
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <Link href="/account/manage">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <User className="w-12 h-12 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Profile Information</h2>
                    <p className="text-muted-foreground">
                      Manage your personal information, password and security
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Link href="/account/addresses">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <Home className="w-12 h-12 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Addresses</h2>
                    <p className="text-muted-foreground">
                      Edit, remove or set default shipping and billing addresses
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Link href="/account/payment">
                <CardContent className="flex items-start gap-4 p-6">
                  <div>
                    <CreditCard className="w-12 h-12 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Payment Methods</h2>
                    <p className="text-muted-foreground">
                      Manage your payment cards and payment preferences
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>Manage how we communicate with you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Newsletters</p>
                    <p className="text-sm text-muted-foreground">Receive updates about new products and sales</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get order updates and alerts via text message</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
