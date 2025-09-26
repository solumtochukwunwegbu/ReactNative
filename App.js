// App.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import IndexPage from "./pages/index";
import Reports from "./pages/reports";
import Service from "./pages/service";
import Users from "./pages/users";
import Settings from "./pages/settings";
import Merchants from "./pages/merchants";

import { Logo } from "./layout";
import LoginModal from "./assets/Login";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLoginSuccess = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Loading state
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // Show login screen if no user
  if (!user) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  // Main app when logged in
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={IndexPage} />
        <Stack.Screen name="Service" component={Service} />
        <Stack.Screen name="Reports" component={Reports} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Merchants" component={Merchants} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
