"use client"
import React, { useState } from 'react';
import {
  Home,
  ShoppingCart,
  BarChart3,
  MapPin,
  Cloud,
  Heart,
  Star,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Plus,
  Minus,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  CheckCircle,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Art = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Food One', price: 14.50, quantity: 1, image: '/api/placeholder/60/60' },
    { id: 2, name: 'Food Four', price: 16.80, quantity: 1, image: '/api/placeholder/60/60' },
    { id: 3, name: 'Food Three', price: 15.50, quantity: 1, image: '/api/placeholder/60/60' }
  ]);

  const menuItems = [
    { icon: Home, label: 'Home', id: 'Home' },
    { icon: ShoppingCart, label: 'Cart', id: 'Cart' },
    { icon: BarChart3, label: 'Traffic', id: 'Traffic' },
    { icon: MapPin, label: 'Hubs', id: 'Hubs' },
    { icon: Cloud, label: 'Weather', id: 'Weather' },
    { icon: Heart, label: 'Satisfaction', id: 'Satisfaction' },
    { icon: Star, label: 'Rating', id: 'Rating' },
  ];

  const foodCategories = [
    { name: 'Food One', restaurants: '12 restaurants', image: '/api/placeholder/300/200' },
    { name: 'Food Two', restaurants: '8 restaurants', image: '/api/placeholder/300/200' },
    { name: 'Food Three', restaurants: '6 restaurants', image: '/api/placeholder/300/200' },
    { name: 'Food Four', restaurants: '4 restaurants', image: '/api/placeholder/300/200' },
  ];

  const topMeals = [
    { name: 'Food One', rating: 4.5, image: '/api/placeholder/200/150' },
    { name: 'Food One', rating: 4.8, image: '/api/placeholder/200/150' },
    { name: 'Food Three', rating: 4.9, image: '/api/placeholder/200/150' },
    { name: 'Food Four', rating: 4.7, image: '/api/placeholder/200/150' },
  ];

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">What would you eat today?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {foodCategories.map((category, index) => (
                  <Card key={index} className="bg-gray-800 border-none rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105">
                    <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-600"></div>
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
                {topMeals.map((meal, index) => (
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
              <h2 className="text-xl font-semibold text-white mb-4">Your Nearest Hubs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-none rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer">
                  <div className="h-48 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white text-lg mb-2">Best Restaurant</h3>
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
                    <h3 className="font-semibold text-white text-lg mb-2">Best Restaurant</h3>
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
        );

      case 'Cart':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Cart</h2>
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="bg-gray-800 border-none rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-gray-400">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </Card>
                ))}
                <Card className="bg-gray-800 border-none rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors h-auto">
                    Checkout
                  </Button>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Your cart is empty</p>
              </div>
            )}
          </div>
        );

      case 'Traffic':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Traffic Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Daily Orders</h3>
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">1,234</p>
                  <p className="text-green-400 text-sm">↑ 12% from yesterday</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Peak Hours</h3>
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">7-9 PM</p>
                  <p className="text-blue-400 text-sm">Most active period</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Conversion Rate</h3>
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">68.5%</p>
                  <p className="text-red-400 text-sm">↓ 2.3% from last week</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gray-800 border-none rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Traffic Sources</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Direct</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-white">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Search Engine</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-white">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Social Media</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-white">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Hubs':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Delivery Hubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Downtown Hub', 'North Hub', 'South Hub', 'East Hub', 'West Hub', 'Central Hub'].map((hub, index) => (
                <Card key={index} className="bg-gray-800 border-none rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">{hub}</h3>
                      <div className={`w-3 h-3 rounded-full ${index % 3 === 0 ? 'bg-green-400' : index % 3 === 1 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Drivers</span>
                        <span className="text-white">{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pending Orders</span>
                        <span className="text-white">{Math.floor(Math.random() * 20) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Delivery Time</span>
                        <span className="text-white">{Math.floor(Math.random() * 20) + 15} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'Weather':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Weather Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">Current Weather</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <Cloud className="w-12 h-12 text-blue-400" />
                    <div>
                      <p className="text-3xl font-bold text-white">22°C</p>
                      <p className="text-gray-400">Cloudy</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Humidity</span>
                      <span className="text-white">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wind Speed</span>
                      <span className="text-white">12 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Visibility</span>
                      <span className="text-white">8 km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">Delivery Impact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Delivery Delay</span>
                      <span className="text-yellow-400">+5 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Order Volume</span>
                      <span className="text-green-400">+15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Driver Availability</span>
                      <span className="text-white">Normal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gray-800 border-none rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-5 gap-4">
                  {['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="text-gray-400 text-sm mb-2">{day}</p>
                      <Cloud className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">{20 + index}°</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Satisfaction':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Customer Satisfaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Overall Score</h3>
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">4.2/5.0</p>
                  <p className="text-green-400 text-sm">↑ 0.3 from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Happy Customers</h3>
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">89%</p>
                  <p className="text-green-400 text-sm">↑ 5% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Response Rate</h3>
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">92%</p>
                  <p className="text-blue-400 text-sm">Customer feedback rate</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gray-800 border-none rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Recent Reviews</h3>
                <div className="space-y-4">
                  {[
                    { name: 'John D.', rating: 5, comment: 'Amazing food and fast delivery!' },
                    { name: 'Sarah M.', rating: 4, comment: 'Good service, will order again.' },
                    { name: 'Mike R.', rating: 5, comment: 'Perfect experience, highly recommended!' }
                  ].map((review, index) => (
                    <div key={index} className="border-l-4 border-gray-600 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{review.name}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-gray-400 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Rating':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">Rating Distribution</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="text-white w-4">{stars}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${stars === 5 ? 60 : stars === 4 ? 25 : stars === 3 ? 10 : stars === 2 ? 3 : 2}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm w-12">{stars === 5 ? '60%' : stars === 4 ? '25%' : stars === 3 ? '10%' : stars === 2 ? '3%' : '2%'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-none rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">Top Rated Items</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Margherita Pizza', rating: 4.9 },
                      { name: 'Chicken Burger', rating: 4.8 },
                      { name: 'Pasta Carbonara', rating: 4.7 },
                      { name: 'Caesar Salad', rating: 4.6 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">{item.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-gray-800 border-none rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Review Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-2">4.2</p>
                    <p className="text-gray-400">Average Rating</p>
                    <div className="flex justify-center mt-2">{renderStars(4)}</div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-2">2,847</p>
                    <p className="text-gray-400">Total Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-2">94%</p>
                    <p className="text-gray-400">Positive Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div className="text-white">Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Delivery</h1>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">Hello James</p>
              <p className="text-sm text-gray-400">It&apos;s been until lunch!</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                  ? 'bg-white text-black font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 h-auto">
            Start New Order
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-800 border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0 focus-visible:border-transparent h-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-white font-medium">James</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-8">
              {renderContent()}
            </div>

            {/* Right Sidebar - My Order (only show on Home page) */}
            {activeTab === 'Home' && (
              <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
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

                <div className="bg-gray-800 rounded-xl p-4 mb-6">
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
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total</span>
                    <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Art;
