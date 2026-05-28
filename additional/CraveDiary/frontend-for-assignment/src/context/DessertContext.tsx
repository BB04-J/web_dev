import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const API_URL = 'http://localhost:5000/api/desserts'

export interface Dessert {
  _id?: string // MongoDB ID
  id: string   // MealDB ID
  name: string
  image: string
  category?: string
  country?: string
  rating?: number
  review?: string
  instructions?: string
  status?: 'wishlist' | 'tried'
  youtube?: string
  ingredients?: string[]
}

interface DessertContextType {
  desserts: Dessert[]
  wishlist: Dessert[]
  tried: Dessert[]
  ratings: Record<string, number>
  notes: Record<string, string>
  addToWishlist: (dessert: Dessert) => Promise<void>
  removeFromWishlist: (dessertId: string) => Promise<void>
  addToTried: (dessert: Dessert) => Promise<void>
  removeFromTried: (dessertId: string) => Promise<void>
  rateDessert: (dessertId: string, rating: number) => Promise<void>
  addNote: (dessertId: string, note: string) => Promise<void>
  searchDesserts: (query: string, category?: string, country?: string) => void
  getDessertsByRating: () => Dessert[]
}

const DessertContext = createContext<DessertContextType | undefined>(undefined)

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return token ? { headers: { Authorization: token } } : {}
}

export const DessertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth()
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [wishlist, setWishlist] = useState<Dessert[]>([])
  const [tried, setTried] = useState<Dessert[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})

  const handleApiError = (error: any, message: string) => {
    console.error(message, error)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('Unauthorized token detected. Clearing storage and logging out...')
      logout()
    }
  }

  // Fetch desserts from database
  const fetchDesserts = async () => {
    try {
      const headers = getAuthHeaders()
      if (!headers.headers) return

      const response = await axios.get(API_URL, headers)
      const data = response.data as any[]
      
      const mappedDesserts: Dessert[] = data.map(d => ({
        _id: d._id,
        id: d.id || d._id,
        name: d.name,
        image: d.image,
        category: d.category,
        country: d.country,
        rating: d.rating,
        review: d.review,
        instructions: d.instructions,
        status: d.status,
        youtube: d.youtube || d.video || '',
        ingredients: d.ingredients || [],
      }))

      setDesserts(mappedDesserts)

      // Map wishlist and tried
      setWishlist(mappedDesserts.filter(d => d.status === 'wishlist'))
      setTried(mappedDesserts.filter(d => d.status === 'tried'))

      // Map ratings and notes
      const initialRatings: Record<string, number> = {}
      const initialNotes: Record<string, string> = {}
      
      mappedDesserts.forEach(d => {
        if (d.rating) initialRatings[d.id] = d.rating
        if (d.review) initialNotes[d.id] = d.review
      })

      setRatings(initialRatings)
      setNotes(initialNotes)
    } catch (error) {
      handleApiError(error, 'Failed to fetch desserts from server:')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchDesserts()
    } else {
      setDesserts([])
      setWishlist([])
      setTried([])
      setRatings({})
      setNotes({})
    }
  }, [isAuthenticated])

  const addToWishlist = async (dessert: Dessert) => {
    try {
      const headers = getAuthHeaders()
      // Check if already in desserts (wishlist or tried)
      const existing = desserts.find(d => d.id === dessert.id)
      if (existing) {
        if (existing.status === 'wishlist') return // already in wishlist
        // If tried, update status to wishlist
        await axios.put(`${API_URL}/${existing._id}`, { status: 'wishlist' }, headers)
        await fetchDesserts()
      } else {
        // Create new
        await axios.post(API_URL, {
          id: dessert.id,
          name: dessert.name,
          image: dessert.image,
          category: dessert.category,
          country: dessert.country,
          instructions: dessert.instructions,
          youtube: dessert.youtube,
          ingredients: dessert.ingredients,
          status: 'wishlist',
        }, headers)
        await fetchDesserts()
      }
    } catch (error) {
      handleApiError(error, 'Failed to add to wishlist:')
    }
  }

  const removeFromWishlist = async (dessertId: string) => {
    try {
      const headers = getAuthHeaders()
      const existing = desserts.find(d => d.id === dessertId)
      if (existing && existing._id) {
        await axios.delete(`${API_URL}/${existing._id}`, headers)
        await fetchDesserts()
      }
    } catch (error) {
      handleApiError(error, 'Failed to remove from wishlist:')
    }
  }

  const addToTried = async (dessert: Dessert) => {
    try {
      const headers = getAuthHeaders()
      const existing = desserts.find(d => d.id === dessert.id)
      if (existing) {
        // Update status to tried
        await axios.put(`${API_URL}/${existing._id}`, { status: 'tried', dateTried: new Date() }, headers)
        await fetchDesserts()
      } else {
        // Create new
        await axios.post(API_URL, {
          id: dessert.id,
          name: dessert.name,
          image: dessert.image,
          category: dessert.category,
          country: dessert.country,
          instructions: dessert.instructions,
          youtube: dessert.youtube,
          ingredients: dessert.ingredients,
          status: 'tried',
          dateTried: new Date(),
        }, headers)
        await fetchDesserts()
      }
    } catch (error) {
      handleApiError(error, 'Failed to add to tried:')
    }
  }

  const removeFromTried = async (dessertId: string) => {
    try {
      const headers = getAuthHeaders()
      const existing = desserts.find(d => d.id === dessertId)
      if (existing && existing._id) {
        await axios.delete(`${API_URL}/${existing._id}`, headers)
        await fetchDesserts()
      }
    } catch (error) {
      handleApiError(error, 'Failed to remove from tried:')
    }
  }

  const rateDessert = async (dessertId: string, rating: number) => {
    try {
      const headers = getAuthHeaders()
      const existing = desserts.find(d => d.id === dessertId)
      if (existing && existing._id) {
        // Use backend rate API
        await axios.post(`${API_URL}/${existing._id}/rate`, { rating, review: notes[dessertId] || '' }, headers)
        await fetchDesserts()
      }
    } catch (error) {
      handleApiError(error, 'Failed to rate dessert:')
    }
  }

  const addNote = async (dessertId: string, note: string) => {
    try {
      const headers = getAuthHeaders()
      const existing = desserts.find(d => d.id === dessertId)
      if (existing && existing._id) {
        // Update the note/review field in database
        await axios.put(`${API_URL}/${existing._id}`, { review: note }, headers)
        await fetchDesserts()
      }
    } catch (error) {
      handleApiError(error, 'Failed to add note:')
    }
  }

  const searchDesserts = (query: string, category?: string, country?: string) => {
    console.log('Searching desserts:', { query, category, country })
  }

  const getDessertsByRating = () => {
    return tried
      .map(d => ({
        ...d,
        rating: ratings[d.id] || 0,
      }))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
  }

  return (
    <DessertContext.Provider
      value={{
        desserts,
        wishlist,
        tried,
        ratings,
        notes,
        addToWishlist,
        removeFromWishlist,
        addToTried,
        removeFromTried,
        rateDessert,
        addNote,
        searchDesserts,
        getDessertsByRating,
      }}
    >
      {children}
    </DessertContext.Provider>
  )
}

export const useDessert = () => {
  const context = useContext(DessertContext)
  if (!context) {
    throw new Error('useDessert must be used within DessertProvider')
  }
  return context
}
