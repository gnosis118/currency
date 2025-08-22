import React from "react";

const BrokersSimple = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Best Forex Brokers 2025
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Compare top-rated forex brokers with detailed reviews and analysis
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">🏦 OANDA</h3>
            <p className="text-gray-600 mb-4">Established forex broker with competitive spreads</p>
            <div className="space-y-2">
              <p><strong>Rating:</strong> 4.8/5</p>
              <p><strong>Min Deposit:</strong> $0</p>
              <p><strong>Spread:</strong> 0.8 pips</p>
              <p><strong>Regulation:</strong> CFTC, NFA</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">💱 FOREX.com</h3>
            <p className="text-gray-600 mb-4">Comprehensive trading platform with advanced tools</p>
            <div className="space-y-2">
              <p><strong>Rating:</strong> 4.6/5</p>
              <p><strong>Min Deposit:</strong> $100</p>
              <p><strong>Spread:</strong> 1.2 pips</p>
              <p><strong>Regulation:</strong> CFTC, NFA</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">📊 Interactive Brokers</h3>
            <p className="text-gray-600 mb-4">Low-cost broker for active traders</p>
            <div className="space-y-2">
              <p><strong>Rating:</strong> 4.7/5</p>
              <p><strong>Min Deposit:</strong> $0</p>
              <p><strong>Spread:</strong> 0.2 pips</p>
              <p><strong>Regulation:</strong> SEC, CFTC, FCA</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            More detailed comparisons and charts coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrokersSimple;

