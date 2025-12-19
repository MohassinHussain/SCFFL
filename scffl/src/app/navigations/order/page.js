// "use client";
// import React, { useState, useEffect } from "react";
// import { Plus, Minus } from "lucide-react";
// import { useRouter } from 'next/navigation';

// // Product catalog
// // const PRODUCT_CATALOG = {
// //   Pulses: ["Toor Dal", "Moong Dal", "Masoor Dal", "Urad Dal", "Chana Dal"],
// //   Millets: ["Ragi", "Bajra", "Jowar", "Foxtail Millet", "Little Millet"],
// //   Vegetables: [
// //     "Tomato",
// //     "Potato",
// //     "Onion",
// //     "Carrot",
// //     "Cabbage",
// //     "Beans",
// //     "Cauliflower",
// //     "Capsicum",
// //     "Spinach",
// //     "Garlic",
// //   ],
// //   Others: ["Rice", "Wheat", "Sugar", "Salt", "Green Tea"],
// // };

// // // Fake pricing
// // const PRICE_LIST = Object.fromEntries(
// //   Object.values(PRODUCT_CATALOG).flatMap((category, i) =>
// //     category.map((item) => [item, (i + 1) * 10])
// //   )
// // );

// export default function Page() {

//   const router = useRouter();

  

//   const [cart, setCart] = useState({});
//   const [productCatalog, setProductCatalog] = useState({});
//   const [priceList, setPriceList] = useState({});


//   useEffect(() => {
//     fetch("http://localhost:8000/get_all_available_products")
//       .then((res) => res.json())
//       .then((data) => {
//         setProductCatalog(data.product_catalog);
//         setPriceList(data.price_list);
//       });
//   }, []);


//   // Load cart from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("cart");
//     if (saved) setCart(JSON.parse(saved));
//   }, []);


//   // Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);


//   const addToCart = (item) => {
//     setCart((prev) => ({
//       ...prev,
//       [item]: (prev[item] || 0) + 1,
//     }));
//   };

//   const removeFromCart = (item) => {
//     setCart((prev) => {
//       const newCart = { ...prev };
//       if (newCart[item]) {
//         newCart[item] -= 1;
//         if (newCart[item] <= 0) delete newCart[item];
//       }
//       return newCart;
//     });
//   };


//   return (
//     <div className="flex flex-col md:flex-row gap-8 p-6">
//       {/* Left - Product categories */}
//       <div className="flex-1 space-y-10">
//         <h1 className="text-2xl font-bold text-white mb-4">
//           🛒 Browse & Select Items
//         </h1>

//         {Object.entries(productCatalog).map(([category, items]) => (
//           <div key={category}>
//             <h2 className="text-xl font-semibold text-orange-400 mb-4">
//               {category}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {items.map((item) => (
//                 <div
//                   key={item}
//                   className="bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition-all"
//                 >
//                   <h3 className="text-lg font-semibold text-white">{item}</h3>
//                   <p className="text-gray-400 mb-4">💰 ₹{priceList[item]}</p>

//                   <div className="flex items-center justify-between">
//                     <button
//                       onClick={() => removeFromCart(item)}
//                       className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center text-white"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                     <span className="text-lg text-white font-bold">
//                       {cart[item] || 0}
//                     </span>
//                     <button
//                       onClick={() => addToCart(item)}
//                       className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center text-white"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Right - Cart */}
//       {/* Right - Cart */}
//       <div className="w-full md:w-80 bg-gray-900 p-6 rounded-xl shadow flex flex-col md:sticky md:top-6 h-fit">
//         <h2 className="text-xl font-semibold text-white mb-4">My Cart</h2>

//         {/* Cart items scroll */}
//         <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-96">
//           {Object.keys(cart).length === 0 ? (
//             <p className="text-gray-400">Your cart is empty</p>
//           ) : (
//             Object.entries(cart).map(([item, qty]) => (
//               <div
//                 key={item}
//                 className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
//               >
//                 <span className="text-white">
//                   {item} × {qty}
//                 </span>
//                 <span className="text-orange-400 font-semibold">
//                   ₹{priceList[item] * qty}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Total pinned at bottom */}
//         {Object.keys(cart).length > 0 && (
//           <div className="mt-6 flex justify-between items-center border-t border-gray-700 pt-4">
//             <span className="text-gray-400">Total</span>
//             <span className="text-2xl font-bold text-white">
//               ₹
//               {Object.entries(cart).reduce(
//                 (sum, [item, qty]) => sum + priceList[item] * qty,
//                 0
//               )}
//             </span>
//           </div>
//         )}

//          <div className="p-4">
//         <button
//         onClick={()=>{
//             router.replace('/navigations/cart');   
//         }}
        
//         className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
//           Go to cart
//         </button>
//       </div>
//       </div>
      

//     </div>
//   );
// }


"use client";
import React from "react";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";


export default function OrderPage() {
  const { cart, addToCart, removeFromCart, productCatalog, priceList } = useCart();
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Left - Products */}
      <div className="flex-1 space-y-10">
        <h1 className="text-2xl font-bold text-white mb-4">🛒 Browse & Select Items</h1>

        {Object.entries(productCatalog).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-orange-400 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item} className="bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition-all">
                  <h3 className="text-lg font-semibold text-white">{item}</h3>
                  <p className="text-gray-400 mb-4">💰 ₹{priceList[item]}</p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => removeFromCart(item)}
                      className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg text-white font-bold">{cart[item] || 0}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 bg-gray-800 hover:bg-gray-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right - Cart */}
      <div className="w-full md:w-80 bg-gray-900 p-6 rounded-xl shadow flex flex-col md:sticky md:top-6 h-fit">
        <h2 className="text-xl font-semibold text-white mb-4">My Cart</h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-96">
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-400">Your cart is empty</p>
          ) : (
            Object.entries(cart).map(([item, qty]) => (
              <div key={item} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                <span className="text-white">{item} × {qty}</span>
                <span className="text-orange-400 font-semibold">₹{priceList[item] * qty}</span>
              </div>
            ))
          )}
        </div>

        {Object.keys(cart).length > 0 && (
          <div className="mt-6 flex justify-between items-center border-t border-gray-700 pt-4">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-bold text-white">
              ₹{Object.entries(cart).reduce((sum, [item, qty]) => sum + priceList[item] * qty, 0)}
            </span>
          </div>
        )}

        <div className="p-4">
          <button
            onClick={() => router.replace("/navigations/cart")}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Go to cart
          </button>
        </div>
      </div>
    </div>
  );
}
