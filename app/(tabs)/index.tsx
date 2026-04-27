import {
  getFavoris,
  getLanguage,
  getVersetDuJour,
  rechercherParMot,
  setLanguage,
} from "@/services/bibleService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [lang, setLang] = useState(getLanguage());
  const [searchQuery, setSearchQuery] = useState("");
  const [resultats, setResultats] = useState<any[]>([]);
  const [versetDuJour, setVersetDuJour] = useState<any>(null);
  const [nbFavoris, setNbFavoris] = useState(0);

  useEffect(() => {
    setVersetDuJour(getVersetDuJour());
    getFavoris().then((favs) => setNbFavoris(favs.length));
  }, [lang]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    setResultats(text.length > 1 ? rechercherParMot(text) : []);
  };

  const changerLangue = (nouvelleLang: "FR" | "EN") => {
    setLanguage(nouvelleLang);
    setLang(nouvelleLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* barre de recherche et chercheur de langue */}
      <View style={styles.headerRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#8D6E63" />
          <TextInput
            placeholder={
              lang === "FR" ? "Chercher un mot..." : "Search a word..."
            }
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={18} color="#D7CCC8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.langContainer}>
          <TouchableOpacity
            style={[styles.langBtn, lang === "FR" && styles.langBtnActive]}
            onPress={() => changerLangue("FR")}
          >
            <Image
              source={{ uri: "https://flagcdn.com/w40/fr.png" }}
              style={styles.flagIcon}
            />
            <Text style={styles.langText}>FR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, lang === "EN" && styles.langBtnActive]}
            onPress={() => changerLangue("EN")}
          >
            <Image
              source={{ uri: "https://flagcdn.com/w40/gb.png" }}
              style={styles.flagIcon}
            />
            <Text style={styles.langText}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {searchQuery.length > 1 ? (
          <View style={styles.resultsPanel}>
            <Text style={styles.sectionTitle}>
              {lang === "FR" ? "Versets trouvés" : "Verses found"} (
              {resultats.length})
            </Text>
            {resultats.map((v, i) => (
              <TouchableOpacity
                key={i}
                style={styles.resCard}
                onPress={() =>
                  router.push({
                    pathname: "/versets",
                    params: {
                      livre: v.book_name,
                      chapitre: v.chapter.toString(),
                    },
                  })
                }
              >
                <Text style={styles.resRef}>
                  {v.book_name} {v.chapter}:{v.verse}
                </Text>
                <Text style={styles.resText} numberOfLines={3}>
                  {v.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <Text style={styles.mainTitle}>Ma Bible</Text>

            {versetDuJour && (
              <View style={styles.versetJourContainer}>
                <Text style={styles.versetJourTitle}>
                  {lang === "FR" ? "Verset du jour" : "Verse of the day"}
                </Text>
                <Text style={styles.versetJourText}>"{versetDuJour.text}"</Text>
                <Text style={styles.versetJourRef}>
                  {versetDuJour.book_name} {versetDuJour.chapter}:
                  {versetDuJour.verse}
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>
              {lang === "FR" ? "Accès rapide" : "Quick access"}
            </Text>

            {/* cart accès rapide avec nom complet */}
            <View style={styles.testamentRow}>
              <TouchableOpacity
                style={styles.testamentCard}
                onPress={() =>
                  router.push({
                    pathname: "/lecture",
                    params: { type: "Ancien" },
                  })
                }
              >
                <Text style={styles.testamentTitle}>
                  {lang === "FR" ? "ANCIEN TESTAMENT" : "OLD TESTAMENT"}
                </Text>
                <Text style={styles.testamentSub}>
                  39 {lang === "FR" ? "livres" : "books"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testamentCard}
                onPress={() =>
                  router.push({
                    pathname: "/lecture",
                    params: { type: "Nouveau" },
                  })
                }
              >
                <Text style={styles.testamentTitle}>
                  {lang === "FR" ? "NOUVEAU TESTAMENT" : "NEW TESTAMENT"}
                </Text>
                <Text style={styles.testamentSub}>
                  27 {lang === "FR" ? "livres" : "books"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* statistiques conservées */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{nbFavoris}</Text>
                <Text style={styles.statLabel}>Favoris</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1</Text>
                <Text style={styles.statLabel}>
                  {lang === "FR" ? "Jour lu" : "Day read"}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0%</Text>
                <Text style={styles.statLabel}>Progression</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  headerRow: { flexDirection: "row", padding: 15, alignItems: "center" },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    alignItems: "center",
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  langContainer: { flexDirection: "row", marginLeft: 10 },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#D7CCC8",
    borderRadius: 8,
    marginLeft: 5,
  },
  langBtnActive: { backgroundColor: "#8D6E63" },
  flagIcon: { width: 18, height: 12, marginRight: 4 },
  langText: { color: "#FFF", fontWeight: "bold", fontSize: 10 },

  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4E342E",
    marginTop: 10,
  },

  versetJourContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 3,
    alignItems: "center",
  },
  versetJourTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8D6E63",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  versetJourText: {
    fontSize: 16,
    color: "#3E2723",
    fontStyle: "italic",
    textAlign: "center",
  },
  versetJourRef: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4E342E",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
    color: "#4E342E",
  },
  testamentRow: { flexDirection: "row", padding: 10 },
  testamentCard: {
    flex: 1,
    backgroundColor: "#8D6E63",
    margin: 10,
    padding: 40,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
  },
  testamentTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  testamentSub: { color: "#D7CCC8", marginTop: 5, fontSize: 11 },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#4E342E" },
  statLabel: { color: "#8D6E63", fontSize: 12 },
  statDivider: { width: 1, height: "100%", backgroundColor: "#EEE" },

  resultsPanel: { padding: 15 },
  resCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  resRef: {
    fontWeight: "bold",
    color: "#8D6E63",
    fontSize: 13,
    marginBottom: 4,
  },
  resText: { color: "#3E2723", fontSize: 14 },
});
