import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function IndexPage() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0) return;
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.title}>Welcome!!!</Text>
    </View>
  );
}