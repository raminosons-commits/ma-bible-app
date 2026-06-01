import { fetchProduits } from "@/services/produitService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProduitsScreen() {
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const LIMIT = 10;
  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    chargerDonnees(currentPage, searchQuery);
  }, [currentPage]);

  const chargerDonnees = async (page: number, recherche: string) => {
    setLoading(true);
    const skip = (page - 1) * LIMIT;
    const result = await fetchProduits(LIMIT, skip, recherche);
    setProduits(result.products);
    setTotalProducts(result.total);
    setLoading(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setCurrentPage(1);
      chargerDonnees(1, text);
    }, 500);
  };

  const totalPages = Math.ceil(totalProducts / LIMIT) || 1;

  const allerPagePrecedente = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const allerPageSuivante = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Gestion des Produits</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#8D6E63" />
        <TextInput
          placeholder="Rechercher un produit..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange("")}>
            <Ionicons name="close-circle" size={18} color="#D7CCC8" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8D6E63" />
        </View>
      ) : (
        <FlatList
          data={produits}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.productCategory}>
                  {item.category.toUpperCase()}
                </Text>
                <Text style={styles.productPrice}>{item.price} $</Text>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.paginationRow}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={allerPagePrecedente}
          disabled={currentPage === 1}
        >
          <Ionicons name="arrow-back" size={18} color="#FFF" />
          <Text style={styles.buttonText}>Précédent</Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>
          Page {currentPage} / {totalPages}
        </Text>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={allerPageSuivante}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.buttonText}>Suivant</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4E342E",
    marginTop: 15,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    margin: 15,
    paddingHorizontal: 15,
    height: 40,
    alignItems: "center",
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    elevation: 1,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  productInfo: { flex: 1, marginLeft: 12 },
  productTitle: { fontSize: 16, fontWeight: "bold", color: "#4E342E" },
  productCategory: {
    fontSize: 11,
    color: "#8D6E63",
    marginTop: 2,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A1887F",
    marginTop: 4,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#EFEBE9",
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8D6E63",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  disabledButton: { backgroundColor: "#D7CCC8" },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginHorizontal: 5,
    fontSize: 13,
  },
  pageIndicator: { fontSize: 14, fontWeight: "bold", color: "#4E342E" },
});
