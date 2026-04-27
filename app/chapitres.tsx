import { getChapitresParLivre } from "@/services/bibleService";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChapitresScreen() {
  const { livre } = useLocalSearchParams();
  const router = useRouter();

  const chapitres = getChapitresParLivre(livre as string);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${livre}`,
          headerTintColor: "#4E342E",
          headerStyle: { backgroundColor: "#F5F5DC" },
        }}
      />

      <FlatList
        data={chapitres}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.chapterBox}
            onPress={() => {
              router.push({
                pathname: "/versets",
                params: {
                  livre: livre as string,
                  chapitre: item.toString(),
                },
              });
            }}
          >
            <Text style={styles.chapterText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  chapterBox: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    backgroundColor: "#8D6E63",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chapterText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
});
