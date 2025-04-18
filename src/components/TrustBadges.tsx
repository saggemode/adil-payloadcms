import React from 'react';

const TrustBadges = () => {
  const badges = [
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "256-bit SSL encryption"
    },
    {
      icon: "🚚",
      title: "Fast Shipping",
      description: "2-3 business days"
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day money back"
    },
    {
      icon: "✅",
      title: "Quality Assured",
      description: "100% satisfaction guarantee"
    }
  ];

  return (
    <div className="w-full   py-10 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-center mb-2">Shop With Confidence</h2>
        <p className="text-center text-gray-600 text-sm mb-8">We pride ourselves on security, reliability, and customer satisfaction</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-5  rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-3">{badge.icon}</div>
              <h3 className="font-semibold text-sm md:text-base">{badge.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10">
          <p className="text-center text-sm font-medium mb-4">Trusted Payment Methods</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-blue-600  text-xs font-semibold rounded shadow-sm">VISA</div>
            <div className="px-4 py-2 bg-red-500  text-xs font-semibold rounded shadow-sm">MASTERCARD</div>
            <div className="px-4 py-2 bg-indigo-600  text-xs font-semibold rounded shadow-sm">AMEX</div>
            <div className="px-4 py-2 bg-blue-500  text-xs font-semibold rounded shadow-sm">PAYPAL</div>
            <div className="px-4 py-2 bg-gray-800  text-xs font-semibold rounded shadow-sm">APPLE PAY</div>
            <div className="px-4 py-2 bg-yellow-500  text-xs font-semibold rounded shadow-sm">DISCOVER</div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
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