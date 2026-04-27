import { getFavoris, toggleFavori } from "@/services/bibleService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavorisScreen() {
  const router = useRouter();
  const [favoris, setFavoris] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavoris().then(setFavoris);
    }, []),
  );

  const supprimerFavori = async (verset: any) => {
    await toggleFavori(verset);
    const updated = await getFavoris();
    setFavoris(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
      </View>

      <FlatList
        data={favoris}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={styles.favCard}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                router.push({
                  pathname: "/versets",
                  params: {
                    livre: item.book_name,
                    chapitre: item.chapter.toString(),
                  },
                })
              }
            >
              <Text style={styles.favRef}>
                {item.book_name} {item.chapter}:{item.verse}
              </Text>
              <Text style={styles.favText}>{item.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => supprimerFavori(item)}>
              <Ionicons name="heart" size={24} color="#E57373" />
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
    padding: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    elevation: 2,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#4E342E" },
  favCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: "center",
  },
  favRef: { fontWeight: "bold", color: "#8D6E63", marginBottom: 5 },
  favText: { fontSize: 15, color: "#3E2723", fontStyle: "italic" },
});
