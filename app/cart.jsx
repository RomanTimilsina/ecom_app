import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { CartContext } from "../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventScreenCapture} from "expo-screen-capture";


const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

    usePreventScreenCapture();
  

  const handleIncrease = async (itemId) => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      updateQuantity(itemId, 1, userId);
    }
  };

  const handleDecrease = async (itemId) => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      updateQuantity(itemId, -1, userId);
    }
  };

  const handleRemove = async (itemId) => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      removeFromCart(itemId, userId);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemText}>
              {item.item} (x{item.quantity})
            </Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleDecrease(item.id)}
              >
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => handleIncrease(item.id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.id)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  itemText: { fontSize: 18 },
  buttons: { flexDirection: "row", alignItems: "center" },
  qtyButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  qtyText: { fontSize: 18, fontWeight: "bold" },
  removeButton: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  removeText: { color: "#fff", fontWeight: "bold" },
});
