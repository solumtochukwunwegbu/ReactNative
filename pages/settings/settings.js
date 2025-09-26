// Settings.js (React Native)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// ✅ Use your computer's IP, not localhost
const API_BASE = "http://192.168.171.35:3001";

export default function Settings() {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
    email: "",
    base_location_state: "",
    base_location_area: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) return;
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);

      if (parsedUser?.email) {
        try {
          const res = await axios.post(`${API_BASE}/api/user`, {
            email: parsedUser.email,
          });
          const data = res.data || {};
          setFormData({
            id: data.id || "",
            username: data.username || "",
            first_name: data.first_name || "",
            middle_name: data.middle_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            email: data.email || "",
            base_location_state: data.base_location_state || "",
            base_location_area: data.base_location_area || "",
            password: "",
          });
        } catch (err) {
          console.error("Error loading user", err);
        }
      }
    };
    loadUser();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = { ...formData };
    if (!payload.password) delete payload.password;

    try {
      await axios.post(`${API_BASE}/api/user/update`, payload);
      Alert.alert("Success", "Profile updated!");
      setShowModal(false);
    } catch (err) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // make sure you have a Login screen
    });
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Not authorized. Please log in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profile}>
        <Text style={styles.heading}>Your Profile</Text>
        <Text>
          <Text style={styles.bold}>Username:</Text> {formData.username}
        </Text>
        <Text>
          <Text style={styles.bold}>Name:</Text> {formData.first_name}{" "}
          {formData.middle_name} {formData.last_name}
        </Text>
        <Text>
          <Text style={styles.bold}>Phone:</Text> {formData.phone}
        </Text>
        <Text>
          <Text style={styles.bold}>Email:</Text> {formData.email}
        </Text>
        <Text>
          <Text style={styles.bold}>State:</Text> {formData.base_location_state}
        </Text>
        <Text>
          <Text style={styles.bold}>Area:</Text> {formData.base_location_area}
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.heading}>Edit Your Profile</Text>
            {[
              "username",
              "first_name",
              "middle_name",
              "last_name",
              "phone",
              "base_location_state",
              "base_location_area",
            ].map((field) => (
              <TextInput
                key={field}
                style={styles.input}
                placeholder={field.replace(/_/g, " ")}
                value={formData[field]}
                onChangeText={(value) => handleChange(field, value)}
              />
            ))}

            {/* Readonly Email */}
            <TextInput
              style={[styles.input, { backgroundColor: "#eee" }]}
              value={formData.email}
              editable={false}
            />

            {/* Password */}
            <TextInput
              style={styles.input}
              placeholder="New Password (leave blank to keep existing)"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => setShowLogoutConfirm(true)}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Confirm Modal */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContainer, { maxWidth: 400 }]}>
            <Text style={styles.heading}>Confirm Logout</Text>
            <Text style={{ marginVertical: 10 }}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Yes, Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

