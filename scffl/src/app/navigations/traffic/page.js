'use client'
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, AlertCircle } from 'lucide-react';

const TrafficPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/traffic/get_analysis', {
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
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Traffic Analytics</h2>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            {loading ? <Activity className="animate-spin w-5 h-5" /> : <Activity className="w-5 h-5" />}
            <span>{loading ? 'Running Analysis...' : 'Run Deep Analysis'}</span>
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
              <Activity className="w-5 h-5 text-green-400 mr-2" />
              Latest Model Metrics (LSTM)
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

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div> */}
      </div>
    </div>
  );
};

export default TrafficPage;