import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { usePreventScreenCapture } from "expo-screen-capture";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, NativeModules } from "react-native";
import { CartContext } from '../context/CartContext';


const Home = () => {
  const [items, setItems] = useState([]);
  const { cart, addToCart, setCart } = useContext(CartContext);
  const router = useRouter();

    usePreventScreenCapture();

      useEffect(() => {
        NativeModules.PreventScreenshot?.enableSecureMode();
        return () => NativeModules.PreventScreenshot?.disableSecureMode();
      }, []);
  

    const [userId, setUserId] = useState(null);

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (!storedUserId) return;
          setUserId(storedUserId);
    
          // fetch user with his cart
          const res = await fetch(`http://192.168.1.65:3000/users/${storedUserId}`);
          const user = await res.json();
          console.log("User loaded:", user);
    
          // load all items
          const itemsRes = await fetch(`http://192.168.1.65:3000/items`);
          const allItems = await itemsRes.json();
          setItems(allItems || []);
    
          // load cart into CartContext
          if (user.cart) {
            setCart(user.cart);
          }
        } catch (err) {
          console.error("Error loading user/cart data:", err);
        }
      };
    
      loadUserData();
    }, []);

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Items</Text>
        <TouchableOpacity 
          style={styles.cartContainer} 
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="cart-outline" size={30} color="#000" />
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {cart.length > 0 && (
        <Text style={styles.simpleText}>(Tap the cart to remove items)</Text>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.item}</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => addToCart(item, userId)} 
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 40 },
  simpleText: { fontSize: 15, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  cartContainer: { position: "relative" },
  badge: { position: "absolute", right: -10, top: -10, backgroundColor: "red", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  itemContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  item: { fontSize: 18 },
  button: { backgroundColor: "#28a745", padding: 8, borderRadius: 6 },
  buttonText: { color: "#fff" },
});
