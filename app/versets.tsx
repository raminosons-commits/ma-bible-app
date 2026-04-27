import { getFavoris, getVersets, toggleFavori } from "@/services/bibleService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VersetsScreen() {
  const { livre, chapitre } = useLocalSearchParams();
  const router = useRouter();
  const [versets, setVersets] = useState([]);
  const [favoris, setFavoris] = useState<any[]>([]);

  useEffect(() => {
    const data = getVersets(livre as string, chapitre);
    setVersets(data);
    chargerFavoris();
  }, [livre, chapitre]);

  const chargerFavoris = async () => {
    const currentFavs = await getFavoris();
    setFavoris(currentFavs);
  };

  const estFavori = (v: any) => {
    return favoris.some(
      (f) =>
        f.book_name === v.book_name &&
        f.chapter === v.chapter &&
        f.verse === v.verse,
    );
  };

  const gererFavori = async (verset: any) => {
    await toggleFavori(verset);
    chargerFavoris();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4E342E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {livre} {chapitre}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={versets}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }: any) => (
          <View style={styles.versetCard}>
            <View style={styles.versetRow}>
              <Text style={styles.versetNumber}>{item.verse}</Text>
              <Text style={styles.versetText}>{item.text}</Text>
            </View>
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => gererFavori(item)}
            >
              <Ionicons
                name={estFavori(item) ? "heart" : "heart-outline"}
                size={22}
                color={estFavori(item) ? "#E57373" : "#D7CCC8"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FFF",
    elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#4E342E" },
  versetCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
  },
  versetRow: { flexDirection: "row", flex: 1 },
  versetNumber: {
    fontWeight: "bold",
    color: "#8D6E63",
    marginRight: 10,
    fontSize: 16,
  },
  versetText: { flex: 1, fontSize: 16, color: "#3E2723", lineHeight: 24 },
  heartButton: { alignSelf: "flex-end", marginTop: 10, padding: 5 },
});
