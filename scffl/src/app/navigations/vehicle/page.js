'use client'
import React, { useState, useEffect } from 'react';
import { Truck, Thermometer, Battery, Activity, Wrench, AlertCircle } from 'lucide-react';

export default function VehiclePage() {
    const [datasetInfo, setDatasetInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDatasetInfo();
    }, []);

    const fetchDatasetInfo = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/vehicle/get_dataset_info');
            const data = await res.json();
            setDatasetInfo(data);
        } catch (err) {
            setError('Failed to load vehicle data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Fleet Intelligence & Vehicle Data</h1>
                <p className="text-gray-400">
                    Comprehensive registry of {datasetInfo?.total_rows?.toLocaleString() || '...'} refrigerated vehicles.
                    This data drives cost calculations and preservation logic.
                </p>
            </header>

            {/* Integration Explanation Section */}
            <section className="bg-gray-800 rounded-xl p-6 border border-blue-900/50">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 text-blue-400 mr-2" />
                    How Vehicle Data Impacts the Project
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-green-400 font-semibold">
                            <Battery className="w-5 h-5" />
                            <span>Cost Efficiency</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            <strong>Fuel Efficiency (L/100km)</strong> directly correlates to distribution costs.
                            Electric and Hybrid vehicles significantly reduce the 'Running Cost' component in our algorithm.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                            <Thermometer className="w-5 h-5" />
                            <span>Product Preservation</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            <strong>Cooling Efficiency (%)</strong> dictates the risk of damage.
                            Aging units with lower efficiency increase the 'Damage Probability', negatively impacting Customer Satisfaction.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-orange-400 font-semibold">
                            <Wrench className="w-5 h-5" />
                            <span>Maintenance Logic</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            <strong>Years in Service</strong> and <strong>Maintenance Hours</strong> act as penalty factors.
                            Older vehicles have a higher probability of breakdown, modeled as random delay spikes in traffic simulation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dataset Statistics */}
            {datasetInfo && (
                <div className="space-y-6">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-white">Vehicle Attributes & Schema</h3>
                            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-mono">
                                {datasetInfo.total_rows.toLocaleString()} Records
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {datasetInfo.columns.map((col) => (
                                <div key={col.name} className={`p-3 rounded border ${['fuel_efficiency_l100km', 'cooling_efficiency_percent', 'years_in_service'].includes(col.name)
                                        ? 'bg-blue-900/20 border-blue-500/30'
                                        : 'bg-gray-900 border-gray-700'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <p className={`font-mono text-sm ${['fuel_efficiency_l100km', 'cooling_efficiency_percent'].includes(col.name)
                                                ? 'text-blue-400 font-bold'
                                                : 'text-gray-300'
                                            }`}>{col.name}</p>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">{col.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-hidden">
                        <h3 className="font-semibold text-white mb-4">Fleet Data Preview</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-gray-900 text-xs uppercase text-gray-400">
                                    <tr>
                                        {datasetInfo.columns.map(col => (
                                            <th key={col.name} className="px-4 py-3 whitespace-nowrap">{col.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {datasetInfo.preview.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                            {datasetInfo.columns.map(col => (
                                                <td key={col.name} className="px-4 py-3 whitespace-nowrap font-mono text-xs text-white">
                                                    {['cooling_efficiency_percent'].includes(col.name) ? (
                                                        <span className={row[col.name] > 90 ? 'text-green-400' : 'text-yellow-400'}>
                                                            {row[col.name]}%
                                                        </span>
                                                    ) : (
                                                        row[col.name]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}