import {
  getAncienTestament,
  getLanguage,
  getLivres,
  getNouveauTestament,
} from "@/services/bibleService";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LectureScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const lang = getLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [livres, setLivres] = useState<any[]>([]);

  useEffect(() => {
    if (type === "Ancien") setLivres(getAncienTestament());
    else if (type === "Nouveau") setLivres(getNouveauTestament());
    else setLivres(getLivres());
  }, [type]);

  // Filtrage des livres par nom
  const livresFiltres = livres.filter((l) =>
    l.nom.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: type === "Tous" ? "Bible" : `${type} Testament`,
          headerTintColor: "#4E342E",
        }}
      />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8D6E63" />
        <TextInput
          style={styles.searchInput}
          placeholder={
            lang === "FR" ? "Chercher un livre..." : "Search a book..."
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={livresFiltres}
        keyExtractor={(item) => item.nom}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.livreItem}
            onPress={() =>
              router.push({
                pathname: "/chapitres",
                params: { livre: item.nom },
              })
            }
          >
            <View style={styles.iconCircle}>
              <Ionicons name="book" size={20} color="#FFF" />
            </View>
            <Text style={styles.livreText}>{item.nom}</Text>
            <Ionicons name="chevron-forward" size={20} color="#D7CCC8" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 45,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 10 },
  livreItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8D6E63",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  livreText: { flex: 1, fontSize: 18, color: "#4E342E" },
});
