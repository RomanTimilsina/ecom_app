// context/CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (item, userId) => {
    const existingItem = cart.find((i) => i.id === item.id);
    let updatedCart;
  
    if (existingItem) {
      updatedCart = cart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }
  
    setCart(updatedCart);
  
    // 🔥 sync with backend
    await fetch(`http://192.168.1.65:3000/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: updatedCart }),
    }).catch((err) => console.error("Error updating cart:", err));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((i) => i.id !== itemId));
  };

  const updateQuantity = async (itemId, amount, userId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((i) =>
        i.id === itemId
          ? { ...i, quantity: Math.max(1, i.quantity + amount) }
          : i
      );
  
      // 🔥 persist to backend
      fetch(`http://192.168.1.65:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      }).catch((err) => console.error("Error updating cart:", err));
  
      return updatedCart;
    });
  };
  

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
