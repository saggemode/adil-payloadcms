import { Data } from '@/types'
import { 
  Tag, 
  ShoppingBag, 
  Package, 
  Award, 
  History, 
  HeadphonesIcon, 
  Users, 
  HelpCircle 
} from 'lucide-react'

const Hdata: Data = {
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
      icon: Tag,
      description: 'Check out our special deals for today',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
      icon: Package,
      description: 'Browse our latest products',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
      icon: ShoppingBag,
      description: 'Discover our highlighted selections',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
      icon: Award,
      description: 'Our most popular products',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
      icon: History,
      description: 'View your recently browsed items',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
      icon: HeadphonesIcon,
      description: 'Get help with your orders and products',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
      icon: Users,
      description: 'Learn more about our company',
    },
    {
      name: 'Help',
      href: '/page/help',
      icon: HelpCircle,
      description: 'Find answers to common questions',
    },
  ],
}

export default Hdata