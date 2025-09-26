// Merchants.js (React Native)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";

// ✅ Replace localhost with your LAN IP
const API_BASE = "http://192.168.171.35:3001";

export default function Merchants() {
  const [activeTab, setActiveTab] = useState("list");
  const [merchants, setMerchants] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    TerminalID: "",
    MerchantName: "",
    Address: "",
    TerminalKey: "",
    phone: "",
    appName: "",
    appVersion: "",
    ptsp: "",
    serial: "",
    type: "",
    model: "",
    connectivity: "",
    network: "",
    latitude: "",
    longitude: "",
    comment: "",
    commentOther: "",
  });

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = () => {
    axios
      .get(`${API_BASE}/api/merchants`)
      .then((res) => setMerchants(res.data))
      .catch((err) => console.error("Fetch error", err));
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (merchant) => {
    setFormData(merchant);
    setActiveTab("form");
  };

  const handleSubmit = () => {
    axios
      .post(`${API_BASE}/api/merchant/update`, formData)
      .then(() => {
        fetchMerchants();
        setActiveTab("list");
      })
      .catch((err) => console.error("Update merchant error", err));
  };

  const renderMerchant = ({ item }) => (
    <View style={styles.merchantItem}>
      <Text style={styles.merchantText}>
        <Text style={{ fontWeight: "bold" }}>{item.MerchantName}</Text> –{" "}
        {item.TerminalID}
      </Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditClick(item)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "form" && styles.activeTab]}
          onPress={() => setActiveTab("form")}
        >
          <Text style={styles.tabText}>Edit Merchant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.activeTab]}
          onPress={() => setActiveTab("list")}
        >
          <Text style={styles.tabText}>Merchant List</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      {activeTab === "form" && (
        <ScrollView style={styles.form}>
          {Object.keys(formData)
            .filter((key) => key !== "id")
            .map((field) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.label}>
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  :
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData[field] || ""}
                  onChangeText={(value) => handleInputChange(field, value)}
                />
              </View>
            ))}
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Merchant List */}
      {activeTab === "list" && (
        <FlatList
          data={merchants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMerchant}
          ListEmptyComponent={<Text>No merchants found.</Text>}
        />
      )}
    </View>
  );
}
