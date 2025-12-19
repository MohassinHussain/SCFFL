// 'use client'
// import React, { useState } from 'react';
// import { ShoppingCart, Plus, Minus } from 'lucide-react';

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([
//     { id: 1, name: 'Food One', price: 14.50, quantity: 1, image: '/api/placeholder/60/60' },
//     { id: 2, name: 'Food Four', price: 16.80, quantity: 1, image: '/api/placeholder/60/60' },
//     { id: 3, name: 'Food Three', price: 15.50, quantity: 1, image: '/api/placeholder/60/60' }
//   ]);

//   const updateQuantity = (id, change) => {
//     setCartItems(prev => prev.map(item => 
//       item.id === id 
//         ? { ...item, quantity: Math.max(1, item.quantity + change) }
//         : item
//     ));
//   };

//   const removeItem = (id) => {
//     setCartItems(prev => prev.filter(item => item.id !== id));
//   };

//   const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   return (
//     <div className="p-8">
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-white">Your Cart</h2>
//         {cartItems.length > 0 ? (
//           <div className="space-y-4">
//             {cartItems.map((item) => (
//               <div key={item.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
//                   <div>
//                     <h3 className="font-semibold text-white">{item.name}</h3>
//                     <p className="text-gray-400">${item.price.toFixed(2)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <button 
//                     onClick={() => updateQuantity(item.id, -1)}
//                     className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <Minus className="w-4 h-4 text-white" />
//                   </button>
//                   <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
//                   <button 
//                     onClick={() => updateQuantity(item.id, 1)}
//                     className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <Plus className="w-4 h-4 text-white" />
//                   </button>
//                   <button 
//                     onClick={() => removeItem(item.id)}
//                     className="ml-4 text-red-400 hover:text-red-300 transition-colors"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//             <div className="bg-gray-800 rounded-xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-xl font-semibold text-white">Total</span>
//                 <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
//               </div>
//               <button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors">
//                 Checkout
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <ShoppingCart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
//             <p className="text-gray-400 text-lg">Your cart is empty</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;


// "use client";
// import React from "react";
// import { ShoppingCart, Plus, Minus } from "lucide-react";
// import { useCart } from "@/app/context/CartContext";

// const CartPage = () => {
//   const { cart, addToCart, removeFromCart, priceList } = useCart();

//   const total = Object.entries(cart).reduce(
//     (sum, [item, qty]) => sum + (priceList[item] || 0) * qty,
//     0
//   );

//   return (
//     <div className="p-8">
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-white">Your Cart</h2>
//         {Object.keys(cart).length > 0 ? (
//           <div className="space-y-4">
//             {Object.entries(cart).map(([item, qty]) => (
//               <div key={item} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
//                 <div>
//                   <h3 className="font-semibold text-white">{item}</h3>
//                   <p className="text-gray-400">₹{priceList[item]}</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => removeFromCart(item)}
//                     className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <Minus className="w-4 h-4 text-white" />
//                   </button>
//                   <span className="text-white font-semibold w-8 text-center">{qty}</span>
//                   <button
//                     onClick={() => addToCart(item)}
//                     className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <Plus className="w-4 h-4 text-white" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//             <div className="bg-gray-800 rounded-xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-xl font-semibold text-white">Total</span>
//                 <span className="text-2xl font-bold text-white">₹{total}</span>
//               </div>
//               <button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors">
//                 Checkout
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <ShoppingCart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
//             <p className="text-gray-400 text-lg">Your cart is empty</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;




"use client";
import React from "react";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const DELIVERY_CHARGE = 50;

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart, priceList } = useCart();

  const subtotal = Object.entries(cart).reduce(
    (sum, [item, qty]) => sum + (priceList[item] || 0) * qty,
    0
  );
  const total = subtotal + (subtotal > 0 ? DELIVERY_CHARGE : 0);

  // remove item completely (instead of decrementing)
  const removeItemCompletely = (item) => {
    Object.keys(cart).includes(item) && removeFromCart(item, "all");
  };

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Header + clear button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          {Object.keys(cart).length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {Object.keys(cart).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(cart).map(([item, qty]) => (
              <div
                key={item}
                className="bg-gray-900 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-white">{item}</h3>
                  <p className="text-gray-400">₹{priceList[item]}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => removeFromCart(item)}
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white font-semibold w-8 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                  {/* remove completely */}
                  <button
                    onClick={() => removeItemCompletely(item)}
                    className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="bg-gray-800 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Delivery Charges</span>
                <span className="text-white font-semibold">₹{DELIVERY_CHARGE}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                <span className="text-xl font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-white">₹{total}</span>
              </div>

              <button className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

