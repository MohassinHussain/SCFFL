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

    return (
       <div className="space-y-6 m-8">
            <h2 className="text-2xl font-bold text-white">Customer Satisfaction</h2>
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
        </div>
    );
}

export default page