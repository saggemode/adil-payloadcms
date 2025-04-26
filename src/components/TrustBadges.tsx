import React from 'react';

const TrustBadges = () => {
  const badges = [
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "100% secure & protected"
    },
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On all orders"
    },
    {
      icon: "↩️",
      title: "90-Day Returns",
      description: "From purchase date"
    },
    {
      icon: "✅",
      title: "Quality Guarantee",
      description: "Satisfaction guaranteed"
    }
  ];

  return (
    <div className="w-full py-8 bg-gray-50 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-center mb-2">Shop With Confidence</h2>
        <p className="text-center text-gray-600 text-sm mb-8">We pride ourselves on security, reliability, and customer satisfaction</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h3 className="font-semibold text-sm md:text-base">{badge.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm font-medium mb-3">Trusted Payment Methods</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded">VISA</div>
            <div className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded">MASTERCARD</div>
            <div className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded">AMEX</div>
            <div className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded">PAYPAL</div>
            <div className="px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded">APPLE PAY</div>
            <div className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-semibold rounded">DISCOVER</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <span className="inline-block mx-1">🔒 Payments secured by industry leaders</span>
            <span className="inline-block mx-1">|</span>
            <span className="inline-block mx-1">⭐ Rated 4.9/5 by our customers</span>
            <span className="inline-block mx-1">|</span>
            <span className="inline-block mx-1">🛡️ Fraud protection guarantee</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges; 