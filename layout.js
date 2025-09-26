// Dashboard.js (React Native)
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo vector icons (similar to FontAwesome)
import { FontAwesome5 } from "@expo/vector-icons";

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const year = new Date().getFullYear();
  const navigation = useNavigation();

  return (
    <View style={[styles.dashboard, isOpen ? styles.open : styles.closed]}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.toggleButtonText}>
          {isOpen ? "↓ Hide Menu" : "↑ Show Menu"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dashContainer}>
          <DashItem label="Dashboard" icon="home" route="Home" />
          <DashItem label="Service" icon="wrench" route="Service" />
          <DashItem label="Merchants" icon="store" route="Merchants" />
          <DashItem label="Reports" icon="chart-bar" route="Reports" />
          <DashItem label="Users" icon="user" route="Users" />
          <DashItem label="Settings" icon="cog" route="Settings" />
        </View>
      )}

      <Text style={styles.copyright}>© {year} Etop.ng</Text>
    </View>
  );
}

// Reusable dash item
function DashItem({ label, icon, route }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.dashItem}
      onPress={() => navigation.navigate(route)}
    >
      <FontAwesome5 name={icon} size={20} color="black" style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

// Logo component
export function Logo() {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("./assets/full_logo.256047a7.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  open: {
    height: "auto",
  },
  closed: {
    height: 60,
  },
  toggleButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dashContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  dashItem: {
    alignItems: "center",
    margin: 10,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
  copyright: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
  },
  logoContainer: {
    alignItems: "center",
    margin: 20,
  },
  logo: {
    width: 120,
    height: 40,
  },
});
