const API_URL = "https://dummyjson.com/products";

// Fonction pour les produits
export const fetchProduits = async (
  limit: number,
  skip: number,
  query: string = "",
) => {
  try {
    let url = "";

    if (query.trim() !== "") {
      // Endpoint de recherche
      url = `${API_URL}/search?limit=${limit}&skip=${skip}&q=${encodeURIComponent(query)}`;
    } else {
      // Endpoint : les liste des produits
      url = `${API_URL}?limit=${limit}&skip=${skip}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données de l'API");
    }

    const data = await response.json();
    return {
      products: data.products || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Erreur produitService :", error);
    return { products: [], total: 0 };
  }
};
