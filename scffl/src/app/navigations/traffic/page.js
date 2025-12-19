'use client'
import React from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

const TrafficPage = () => {
  return (
    <div className="p-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Traffic Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Daily Orders</h3>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">1,234</p>
            <p className="text-green-400 text-sm">↑ 12% from yesterday</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Peak Hours</h3>
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">7-9 PM</p>
            <p className="text-blue-400 text-sm">Most active period</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Conversion Rate</h3>
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">68.5%</p>
            <p className="text-red-400 text-sm">↓ 2.3% from last week</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Direct</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-white">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Search Engine</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
                <span className="text-white">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Social Media</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <span className="text-white">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficPage;