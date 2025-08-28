// context/CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (item, userId) => {
    const normalizedId = String(item.id); // make sure ID is always a string
  
    const existingItem = cart.find((i) => String(i.id) === normalizedId);
  
    let updatedCart;
    if (existingItem) {
      // increase quantity if already in cart
      updatedCart = cart.map((i) =>
        String(i.id) === normalizedId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      // add new item with quantity = 1
      updatedCart = [...cart, { ...item, id: normalizedId, quantity: 1 }];
    }
  
    setCart(updatedCart);
  
    // sync with backend
    try {
      await fetch(`http://192.168.1.65:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };
  

  const removeFromCart = async (itemId, userId) => {
    const updatedCart = cart.filter((i) => i.id !== itemId);
    setCart(updatedCart);
  
    try {
      await fetch(`http://192.168.1.65:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
    } catch (err) {
      console.error("Error syncing cart after removal:", err);
    }
  };

  const updateQuantity = async (itemId, amount, userId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((i) =>
        i.id === itemId
          ? { ...i, quantity: Math.max(1, i.quantity + amount) }
          : i
      );
  
      //  persist to backend
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
