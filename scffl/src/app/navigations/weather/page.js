import React from 'react'
import { Cloud } from 'lucide-react';

function page() {
    return (
        <div className="space-y-6 p-8">
            <h2 className="text-2xl font-bold text-white">Weather Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
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
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
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
                </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
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
            </div>
        </div>
    );
}

export default page