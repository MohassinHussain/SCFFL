"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [priceList, setPriceList] = useState({});
    const [productCatalog, setProductCatalog] = useState({});

    // Fetch products & prices
    useEffect(() => {
        fetch("http://localhost:8000/get_all_available_products")
            .then((res) => res.json())
            .then((data) => {
                setProductCatalog(data.product_catalog);
                setPriceList(data.price_list);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    // Load cart from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prev) => ({
            ...prev,
            [item]: (prev[item] || 0) + 1,
        }));
    };

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

    const removeFromCart = (item, mode = "one") => {
        setCart((prev) => {
            const newCart = { ...prev };
            if (!newCart[item]) return prev;

            if (mode === "all") {
                delete newCart[item];   // remove completely
            } else {
                newCart[item] -= 1;
                if (newCart[item] <= 0) delete newCart[item];
            }
            return newCart;
        });
    };


    const clearCart = () => setCart({});

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart, priceList, productCatalog }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook
export const useCart = () => useContext(CartContext);
