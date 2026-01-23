'use client'
import React, { useState } from 'react'
import { Cloud, Activity, Wind, Droplets, Eye, AlertCircle } from 'lucide-react';

function page() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const runAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/weather/get_analysis', {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok) {
                setAnalysis(data.analysis);
            } else {
                setError(data.detail || 'Analysis failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Weather Impact</h2>
                <button
                    onClick={runAnalysis}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                    {loading ? <Activity className="animate-spin w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    <span>{loading ? 'Analyzing...' : 'Analyze Weather Models'}</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {analysis && (
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                    <h3 className="font-semibold text-white mb-4 flex items-center">
                        <Activity className="w-5 h-5 text-blue-400 mr-2" />
                        Weather Prediction Model (LSTM)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Training Loss</p>
                            <p className="text-2xl font-mono text-white">{analysis.training_loss?.toFixed(4)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Validation Loss</p>
                            <p className="text-2xl font-mono text-blue-400">{analysis.validation_loss?.toFixed(4)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">MAE</p>
                            <p className="text-2xl font-mono text-green-400">{analysis.mean_absolute_error?.toFixed(4)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Validation MAE</p>
                            <p className="text-2xl font-mono text-purple-400">{analysis.val_mean_absolute_error?.toFixed(4)}</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 text-right">
                        Trained on {analysis.epochs} epochs
                    </p>
                </div>
            )}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <span className="text-gray-400 flex items-center"><Droplets className="w-4 h-4 mr-2" /> Humidity</span>
                            <span className="text-white">68%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center"><Wind className="w-4 h-4 mr-2" /> Wind Speed</span>
                            <span className="text-white">12 km/h</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center"><Eye className="w-4 h-4 mr-2" /> Visibility</span>
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
            </div> */}
        </div>
    );
}

export default page