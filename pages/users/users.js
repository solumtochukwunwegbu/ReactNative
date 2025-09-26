// Users.js (React Native)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

// ✅ Use LAN IP for backend instead of localhost
const API_BASE = "http://192.168.171.35:3001";

export default function Users() {
  const [activeTab, setActiveTab] = useState("list");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    email: "",
    base_location_state: "",
    base_location_area: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(`${API_BASE}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Fetch error", err));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (userId, newStatus) => {
    axios
      .post(`${API_BASE}/api/user/status`, { id: userId, status: newStatus })
      .then(() => fetchUsers())
      .catch((err) => console.error("Status update error", err));
  };

  const handleSubmit = () => {
    axios
      .post(`${API_BASE}/api/users`, formData)
      .then(() => {
        setFormData({
          username: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          phone: "",
          email: "",
          base_location_state: "",
          base_location_area: "",
          password: "",
        });
        fetchUsers();
        setActiveTab("list");
      })
      .catch((err) => console.error("Add user error", err));
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "form" && styles.activeTab]}
          onPress={() => setActiveTab("form")}
        >
          <Text style={styles.tabText}>Add User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.activeTab]}
          onPress={() => setActiveTab("list")}
        >
          <Text style={styles.tabText}>User List</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      {activeTab === "form" && (
        <View style={styles.form}>
          {Object.keys(formData).map((field) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>
                {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
              </Text>
              <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={(value) => handleInputChange(field, value)}
                placeholder={field}
                secureTextEntry={field === "password"}
                keyboardType={field === "email" ? "email-address" : "default"}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Create User</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User List */}
      {activeTab === "list" && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No users found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {item.first_name} {item.middle_name} {item.last_name}
                </Text>
                <Text style={styles.userHandle}>@{item.username}</Text>
              </View>
              <Picker
                selectedValue={item.status}
                style={styles.picker}
                onValueChange={(value) => handleStatusChange(item.id, value)}
              >
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Suspended" value="suspended" />
              </Picker>
            </View>
          )}
        />
      )}
    </View>
  );
}

