'use client'

import React from 'react'
import { Heart, Users, Package, Star } from 'lucide-react';

function page() {


    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
            />
        ));
    };

    const [datasetInfo, setDatasetInfo] = React.useState(null);

    return (
        <div className="space-y-6 m-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Customer Satisfaction</h2>
                <button
                    onClick={async () => {
                        const res = await fetch('http://127.0.0.1:8000/traffic/get_dataset_info');
                        const data = await res.json();
                        setDatasetInfo(data);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                    View Underlying Data
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Overall Score</h3>
                        <Heart className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">4.2/5.0</p>
                    <p className="text-green-400 text-sm">↑ 0.3 from last month</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Happy Customers</h3>
                        <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">89%</p>
                    <p className="text-green-400 text-sm">↑ 5% from last month</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Response Rate</h3>
                        <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">92%</p>
                    <p className="text-blue-400 text-sm">Customer feedback rate</p>
                </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
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
            </div>


            {
                datasetInfo && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="font-semibold text-white mb-4">Satisfaction Data Factors</h3>
                            <p className="text-gray-400 text-sm mb-4">The following variables from our Traffic Dataset directly influence the Fuzzy Logic Satisfaction Score.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {datasetInfo.columns.filter(c => ['customer_satisfaction', 'quality_score', 'time_deviation', 'traffic_index', 'distribution_cost'].includes(c.name)).map((col) => (
                                    <div key={col.name} className="bg-gray-900 p-3 rounded border border-yellow-900/50">
                                        <p className="text-yellow-400 font-mono text-sm">{col.name}</p>
                                        <p className="text-gray-500 text-xs mt-1">{col.description}</p>
                                    </div>
                                ))}
                                {datasetInfo.columns.filter(c => !['customer_satisfaction', 'quality_score', 'time_deviation', 'traffic_index', 'distribution_cost'].includes(c.name)).map((col) => (
                                    <div key={col.name} className="bg-gray-900 p-3 rounded border border-gray-700 opacity-60">
                                        <p className="text-gray-500 font-mono text-sm">{col.name}</p>
                                        <p className="text-gray-600 text-xs mt-1">{col.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-hidden">
                            <h3 className="font-semibold text-white mb-4">Historical Data Preview</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-gray-900 text-xs uppercase bg-gray-700 text-gray-400">
                                        <tr>
                                            {datasetInfo.columns.map(col => (
                                                <th key={col.name} className="px-4 py-2 whitespace-nowrap">{col.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datasetInfo.preview.map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50">
                                                {datasetInfo.columns.map(col => (
                                                    <td key={col.name} className="px-4 py-3 whitespace-nowrap font-mono text-xs text-white">
                                                        {row[col.name]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default page