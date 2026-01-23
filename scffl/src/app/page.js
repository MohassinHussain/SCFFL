

'use client'
import React, { useState } from 'react';
import { Star, Eye, CheckCircle, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {





  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Food One', price: 14.50, quantity: 1, image: '/api/placeholder/60/60' },
    { id: 2, name: 'Food Four', price: 16.80, quantity: 1, image: '/api/placeholder/60/60' },
    { id: 3, name: 'Food Three', price: 15.50, quantity: 1, image: '/api/placeholder/60/60' }
  ]);

  const productCategories = [
    { name: 'Vegetables', restaurants: '12 restaurants', image: '/images/vegetables/image.png' },
    { name: 'Pulses', restaurants: '8 restaurants', image: '/images/pulses/image.png' },
    { name: 'Millets', restaurants: '6 restaurants', image: '/images/millets/image.png' },
    { name: 'Others', restaurants: '4 restaurants', image: '/images/others/image.png' },
  ];

  const topProducts = [
    { name: 'Tomato', rating: 4.5, image: '/api/placeholder/200/150' },
    { name: 'Potato', rating: 4.8, image: '/api/placeholder/200/150' },
    { name: 'Buffallo Milk', rating: 4.9, image: '/api/placeholder/200/150' },
    { name: 'Milk Four', rating: 4.7, image: '/api/placeholder/200/150' },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">What would you eat today?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productCategories.map((category, index) => (
                <Card key={index} className="bg-gray-800 border-none rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <div className="h-10 bg-gradient-to-r from-gray-700 to-gray-600">
                    <Image
                      src={category.image}
                      alt="Logo"
                      width={300}
                      height={200}

                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.restaurants}</p>

                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Meals */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Top meals this week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topProducts.map((meal, index) => (
                <Card key={index} className="bg-gray-800 border-none rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">{meal.name}</h3>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(meal.rating))}
                      <span className="text-gray-400 text-sm ml-2">{meal.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Favourite Restaurants */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Your nearest Hubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-none rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer">
                <div className="h-48 bg-gradient-to-r from-yellow-500 to-orange-500">
                  {/* <Image
                      src="/images/hubs/image1.png"
                      alt="Logo"
                      width={600}
                      height={200}
                      
                    /> */}
                </div>
                <CardContent className="p-6 ">
                  <h3 className="font-semibold text-white text-lg mb-2">Best hub</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">📍 1234 Street Name, City Name</p>
                  <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer">
                <div className="h-48 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white text-lg mb-2">Great hub</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">📍 1234 Street Name, City Name</p>
                  <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - My Order */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 rounded-3xl my-8 mx-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">My Order</h3>
            <button className="text-gray-400 hover:text-white">
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            <p>📍 09:40 AM</p>
            <p>📍 1234 Street Name, City Name</p>
            <p className="text-orange-400">Orders must stay warm</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {cartItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.name}</p>
                <div className="flex items-center space-x-2">
                  <button className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs transition-colors">
                    -
                  </button>
                  <span className="text-white text-sm">{item.quantity}</span>
                  <button className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs transition-colors">
                    +
                  </button>
                </div>
              </div>
              <p className="text-white font-semibold">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <Card className="bg-gray-800 border-none rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-2">
              <span>•••• •••• ••••</span>
              <span>12:34</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Available funds</span>
              <span>Orders</span>
              <span>City</span>
            </div>
            <div className="flex justify-between text-sm text-white">
              <span>$1,234.56</span>
              <span>1234</span>
              <span>123</span>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 h-auto">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;