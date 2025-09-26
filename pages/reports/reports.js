import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

// ✅ Use your computer's LAN IP instead of localhost
const API_BASE = "http://192.168.171.35:3001";

function isArchived(uploadedAt) {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return new Date() - new Date(uploadedAt) > oneWeek;
}

function getStatusColor(status) {
  switch (status) {
    case "local":
      return { color: "red" };
    case "uploaded":
      return { color: "blue" };
    case "archived":
      return { color: "green" };
    default:
      return {};
  }
}

export default function ReportTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetch(`${API_BASE}/api/captured-data`)
      .then((response) => response.json())
      .then((fetchedData) => {
        const updated = fetchedData.map((item) => {
          if (item.syncStatus === "uploaded" && isArchived(item.uploadedAt)) {
            return { ...item, syncStatus: "archived" };
          }
          return item;
        });
        setData(updated);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      });
  }

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  const renderHeader = () => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#f3f3f3",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>ID</Text>
      <Text style={{ flex: 2, fontWeight: "bold", textAlign: "center" }}>Name</Text>
      <Text style={{ flex: 3, fontWeight: "bold", textAlign: "center" }}>Captured At</Text>
      <Text style={{ flex: 2, fontWeight: "bold", textAlign: "center" }}>Sync Status</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 8,
      }}
    >
      <Text style={{ flex: 1, textAlign: "center" }}>{item.id}</Text>
      <Text style={{ flex: 2, textAlign: "center" }}>{item.name}</Text>
      <Text style={{ flex: 3, textAlign: "center" }}>
        {new Date(item.capturedAt).toLocaleString()}
      </Text>
      <Text
        style={[
          { flex: 2, textAlign: "center" },
          getStatusColor(item.syncStatus),
        ]}
      >
        {item.syncStatus}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Data Sync Report
      </Text>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

