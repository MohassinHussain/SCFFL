'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  BarChart3,
  MapPin,
  Cloud,
  Heart,
  Star,
  User,
  Car
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingCart, label: 'Cart', href: '/navigations/cart' },
    { icon: BarChart3, label: 'Traffic', href: '/navigations/traffic' },
    { icon: MapPin, label: 'Hubs', href: '/navigations/hubs' },
    { icon: Cloud, label: 'Weather', href: '/navigations/weather' },
    { icon: Car, label: 'Vehicle', href: '/navigations/vehicle' },
    { icon: Heart, label: 'Satisfaction', href: '/navigations/satisfaction' },
    { icon: Star, label: 'Rating', href: '/navigations/rating' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-6">
        <h1 className="font-bold text-white mb-2">SCFFL</h1>
        <div className="flex items-center space-x-3 mb-6">
          {/* <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">Hello James</p>
            <p className="text-sm text-gray-400">It's been until lunch!</p>
          </div> */}
        </div>
      </div>

      <nav className="px-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-white text-black font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Button
          onClick={() => {
            router.replace('/navigations/order');
          }}

          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 h-auto">
          Order
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;