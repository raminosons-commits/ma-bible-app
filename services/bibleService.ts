import AsyncStorage from "@react-native-async-storage/async-storage";

const bibleFR = require("../assets/segond_1910.json");
const bibleEN = require("../assets/kjv.json");

let langueActuelle: "FR" | "EN" = "FR";
const FAVORITES_KEY = "@ma_bible_favoris";

export const setLanguage = (lang: "FR" | "EN") => {
  langueActuelle = lang;
};

export const getLanguage = () => langueActuelle;

const getSourceData = () => (langueActuelle === "FR" ? bibleFR : bibleEN);

export const rechercherParMot = (mot: string) => {
  const data = getSourceData();
  if (!data || !data.verses || mot.length < 2) return [];

  const motCible = mot.toLowerCase().trim();

  return data.verses
    .filter((v: any) => v.text.toLowerCase().includes(motCible))
    .slice(0, 50);
};

export const getLivres = () => {
  const data = getSourceData();
  if (data && data.verses) {
    const nomsLivres = [
      ...new Set(data.verses.map((v: any) => String(v.book_name))),
    ];
    return nomsLivres.map((nom) => ({ nom }));
  }
  return [];
};

export const getAncienTestament = () => {
  return getLivres().slice(0, 39);
};

export const getNouveauTestament = () => {
  return getLivres().slice(39);
};

export const getChapitresParLivre = (nomLivre: string) => {
  const data = getSourceData();
  if (!data || !data.verses) return [];

  const livreCible = String(nomLivre).trim().toLowerCase();

  const chapitresUnique = [
    ...new Set(
      data.verses
        .filter(
          (v: any) => String(v.book_name).trim().toLowerCase() === livreCible,
        )
        .map((v: any) => v.chapter),
    ),
  ];

  return chapitresUnique.sort((a, b) => Number(a) - Number(b));
};

export const getVersets = (nomLivre: string, numChapitre: any) => {
  const data = getSourceData();
  if (!data || !data.verses) return [];

  const livreCible = String(nomLivre).trim().toLowerCase();
  const chapitreCible = Number(numChapitre);

  return data.verses.filter(
    (v: any) =>
      String(v.book_name).trim().toLowerCase() === livreCible &&
      Number(v.chapter) === chapitreCible,
  );
};

//  Verset du jour

export const getVersetDuJour = () => {
  const data = getSourceData();
  if (!data || !data.verses) return null;

  const today = new Date();
  const dateSeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = dateSeed % data.verses.length;

  return data.verses[index];
};

// Favoris

export const getFavoris = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const toggleFavori = async (versetObj: any) => {
  try {
    const favorisExistants = await getFavoris();
    const index = favorisExistants.findIndex(
      (f: any) =>
        f.book_name === versetObj.book_name &&
        f.chapter === versetObj.chapter &&
        f.verse === versetObj.verse,
    );

    if (index > -1) {
      favorisExistants.splice(index, 1);
    } else {
      favorisExistants.push(versetObj);
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorisExistants));
    return favorisExistants;
  } catch (e) {
    return [];
  }
};
