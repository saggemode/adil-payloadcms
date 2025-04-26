import Link from 'next/link'
// ...existing imports...

// Define the Props type
type Props = {
  categories: string[]; // Adjust the type based on the actual structure of categories
};

export const Header: React.FC<Props> = ({ categories }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      {/* Top banner */}
      <div className="bg-[#33A1E6] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Free shipping on all orders</span>
            <span>Limited-time offer</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Return within 90d</span>
            <span>From purchase date</span>
            <Link href="/download" className="flex items-center">
              Get the Temu App
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="Logo" className="h-10" />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2 border-2 border-[#33A1E6] rounded-full focus:outline-none focus:border-[#2890d5]"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-[#33A1E6] text-white rounded-r-full hover:bg-[#2890d5]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/orders" className="text-gray-700 hover:text-[#33A1E6]">
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1">Orders & Account</span>
              </div>
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-[#33A1E6]">
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs mt-1">Support</span>
              </div>
            </Link>
            <button className="text-gray-700 hover:text-[#33A1E6] relative">
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs mt-1">Cart</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </div>
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="mt-4">
          <ul className="flex space-x-6">
            <li>
              <Link href="/categories" className="text-gray-700 hover:text-[#33A1E6] font-medium">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/best-selling" className="text-gray-700 hover:text-[#33A1E6]">
                Best-Selling Items
              </Link>
            </li>
            <li>
              <Link href="/5-star" className="text-gray-700 hover:text-[#33A1E6]">
                5-Star Rated
              </Link>
            </li>
            <li>
              <Link href="/new" className="text-gray-700 hover:text-[#33A1E6]">
                New In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}