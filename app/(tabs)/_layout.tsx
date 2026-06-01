import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { BookOpen, Heart, Home, ShoppingBag } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarStyle: { backgroundColor: Colors.light.background },
        headerStyle: { backgroundColor: Colors.light.background },
        headerTintColor: Colors.light.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lecture"
        options={{
          title: "Lire",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      {/* NOUVEL ONGLET AJOUTÉ POUR TON EXERCICE DE GESTION DES PRODUITS */}
      <Tabs.Screen
        name="produits"
        options={{
          title: "Produits",
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
