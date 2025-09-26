// Service.js (React Native)
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "react-native-image-picker";
import Geolocation from "@react-native-community/geolocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Use your computer's LAN IP instead of localhost
const API_BASE = "http://192.168.171.35:3001";

export default function Service() {
  const [formData, setFormData] = useState({
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
    receipt: null,
  });

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function getLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        Alert.alert(
          "Location Captured",
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      },
      (error) => {
        Alert.alert("Error", "Error getting location: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  async function pickImage() {
    const result = await ImagePicker.launchCamera({
      mediaType: "photo",
      includeBase64: false,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setFormData((prev) => ({
        ...prev,
        receipt: result.assets[0],
      }));
    }
  }

  async function handleSubmit() {
    const form = new FormData();
    for (const key in formData) {
      if (key === "receipt" && formData.receipt) {
        form.append("receipt", {
          uri: formData.receipt.uri,
          name: formData.receipt.fileName || "receipt.jpg",
          type: formData.receipt.type || "image/jpeg",
        });
      } else {
        form.append(key, formData[key]);
      }
    }

    // ✅ Append user_id from AsyncStorage
    const stored = await AsyncStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    if (user?.id) {
      form.append("user_id", user.id);
    }

    try {
      const res = await fetch(`${API_BASE}/api/submit-service`, {
        method: "POST",
        body: form,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.ok) {
        Alert.alert("Success", "Form submitted successfully!");
      } else {
        Alert.alert("Error", "Submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "An error occurred while submitting.");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Terminal ID</Text>
      <TextInput
        value={formData.TerminalID}
        onChangeText={(v) => handleChange("TerminalID", v)}
      />

      <Text>Merchant Name</Text>
      <TextInput
        value={formData.MerchantName}
        onChangeText={(v) => handleChange("MerchantName", v)}
      />

      <Text>Address</Text>
      <TextInput
        value={formData.Address}
        onChangeText={(v) => handleChange("Address", v)}
        multiline
      />

      <Text>Terminal Key</Text>
      <TextInput
        value={formData.TerminalKey}
        onChangeText={(v) => handleChange("TerminalKey", v)}
      />

      <Text>Phone</Text>
      <TextInput
        value={formData.phone}
        onChangeText={(v) => handleChange("phone", v)}
      />

      <Text>Application Name</Text>
      <TextInput
        value={formData.appName}
        onChangeText={(v) => handleChange("appName", v)}
      />

      <Text>Application Version</Text>
      <TextInput
        value={formData.appVersion}
        onChangeText={(v) => handleChange("appVersion", v)}
      />

      <Text>PTSP</Text>
      <TextInput
        value={formData.ptsp}
        onChangeText={(v) => handleChange("ptsp", v)}
      />

      <Text>Terminal Serial</Text>
      <TextInput
        value={formData.serial}
        onChangeText={(v) => handleChange("serial", v)}
      />

      <Text>Terminal Type</Text>
      <TextInput
        value={formData.type}
        onChangeText={(v) => handleChange("type", v)}
      />

      <Text>Terminal Model</Text>
      <TextInput
        value={formData.model}
        onChangeText={(v) => handleChange("model", v)}
      />

      <Text>Connectivity</Text>
      <Picker
        selectedValue={formData.connectivity}
        onValueChange={(v) => handleChange("connectivity", v)}
      >
        <Picker.Item label="--Select--" value="" />
        <Picker.Item label="WIFI" value="WIFI" />
        <Picker.Item label="GPRS" value="GPRS" />
        <Picker.Item label="Data" value="Data" />
      </Picker>

      <Text>Network</Text>
      <Picker
        selectedValue={formData.network}
        onValueChange={(v) => handleChange("network", v)}
      >
        <Picker.Item label="--Select--" value="" />
        <Picker.Item label="MTN" value="MTN" />
        <Picker.Item label="AIRTEL" value="AIRTEL" />
        <Picker.Item label="GLO" value="GLO" />
        <Picker.Item label="9MOBILE" value="9MOBILE" />
      </Picker>

      <TouchableOpacity onPress={pickImage}>
        <Text>Upload Receipt</Text>
      </TouchableOpacity>
      {formData.receipt && (
        <Image
          source={{ uri: formData.receipt.uri }}
          style={{ width: 100, height: 100, marginTop: 10 }}
        />
      )}

      <Text>Comment</Text>
      <Picker
        selectedValue={formData.comment}
        onValueChange={(v) => handleChange("comment", v)}
      >
        <Picker.Item label="--Select--" value="" />
        <Picker.Item label="Damaged battery" value="Damaged battery" />
        <Picker.Item
          label="Terminal working fine with an approved transaction done"
          value="Terminal working fine with an approved transaction done"
        />
        <Picker.Item label="Others" value="Others" />
      </Picker>

      <Text>Comment (Other)</Text>
      <TextInput
        value={formData.commentOther}
        onChangeText={(v) => handleChange("commentOther", v)}
        multiline
      />

      <TouchableOpacity onPress={getLocation}>
        <Text>📍 Capture Location</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit}>
        <Text>✅ Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
