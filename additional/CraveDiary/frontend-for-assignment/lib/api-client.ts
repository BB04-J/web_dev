import axios from 'axios'

const API_BASE = 'https://www.themealdb.com/api/json/v1/1'

export interface DessertResponse {
  meals: Array<{
    idMeal: string
    strMeal: string
    strCategory?: string
    strArea?: string
    strMealThumb?: string
    strInstructions?: string
    [key: string]: any
  }> | null
}

export const api = {
  // Search desserts by name
  searchDesserts: async (query: string): Promise<DessertResponse> => {
    try {
      const response = await axios.get(`${API_BASE}/search.php?s=${query}`)
      return response.data
    } catch (error) {
      console.error('Error searching desserts:', error)
      throw error
    }
  },

  // Get desserts by category (dessert-specific)
  getDessertsByCategory: async (): Promise<DessertResponse> => {
    try {
      // Get all meals with category "Dessert"
      const response = await axios.get(`${API_BASE}/filter.php?c=Dessert`)
      return response.data
    } catch (error) {
      console.error('Error fetching desserts by category:', error)
      throw error
    }
  },

  // Get random dessert
  getRandomDessert: async (): Promise<DessertResponse> => {
    try {
      const response = await axios.get(`${API_BASE}/random.php`)
      return response.data
    } catch (error) {
      console.error('Error fetching random dessert:', error)
      throw error
    }
  },

  // Get dessert details by ID
  getDessertDetails: async (id: string): Promise<DessertResponse> => {
    try {
      const response = await axios.get(`${API_BASE}/lookup.php?i=${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching dessert details:', error)
      throw error
    }
  },

  // Get desserts by area/country
  getDessertsByArea: async (area: string): Promise<DessertResponse> => {
    try {
      const response = await axios.get(`${API_BASE}/filter.php?a=${area}`)
      return response.data
    } catch (error) {
      console.error('Error fetching desserts by area:', error)
      throw error
    }
  },

  // Get list of all areas
  getAreas: async (): Promise<{ meals: Array<{ strArea: string }> } | null> => {
    try {
      const response = await axios.get(`${API_BASE}/list.php?a=list`)
      return response.data
    } catch (error) {
      console.error('Error fetching areas:', error)
      throw error
    }
  },

  // Get list of all ingredients
  getIngredients: async (): Promise<{ meals: Array<{ strIngredient: string }> } | null> => {
    try {
      const response = await axios.get(`${API_BASE}/list.php?i=list`)
      return response.data
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      throw error
    }
  },
}

export default api
