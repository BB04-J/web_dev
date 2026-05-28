'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Dessert {
  idMeal: string
  strMeal: string
  strCategory?: string
  strArea?: string
  strMealThumb?: string
  strInstructions?: string
  ingredients?: Array<{
    name: string
    measure: string
  }>
}

export interface UserDessert extends Dessert {
  inWishlist: boolean
  isTried: boolean
  rating?: number
  notes?: string
}

interface DessertContextType {
  desserts: UserDessert[]
  wishlisted: Set<string>
  tried: Map<string, { rating?: number; notes?: string }>
  addToWishlist: (dessert: Dessert) => void
  removeFromWishlist: (dessertId: string) => void
  markAsTried: (dessertId: string, rating?: number, notes?: string) => void
  unmarkAsTried: (dessertId: string) => void
  rateDessert: (dessertId: string, rating: number) => void
}

const DessertContext = createContext<DessertContextType | undefined>(undefined)

export const DessertProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set())
  const [tried, setTried] = useState<Map<string, { rating?: number; notes?: string }>>(new Map())
  const [desserts, setDesserts] = useState<UserDessert[]>([])

  useEffect(() => {
    // Load from localStorage on mount
    const wishlistData = localStorage.getItem('dessert-wishlist')
    const triedData = localStorage.getItem('dessert-tried')

    if (wishlistData) {
      setWishlisted(new Set(JSON.parse(wishlistData)))
    }
    if (triedData) {
      setTried(new Map(JSON.parse(triedData)))
    }
  }, [])

  const addToWishlist = (dessert: Dessert) => {
    const newWishlisted = new Set(wishlisted)
    newWishlisted.add(dessert.idMeal)
    setWishlisted(newWishlisted)
    localStorage.setItem('dessert-wishlist', JSON.stringify(Array.from(newWishlisted)))
  }

  const removeFromWishlist = (dessertId: string) => {
    const newWishlisted = new Set(wishlisted)
    newWishlisted.delete(dessertId)
    setWishlisted(newWishlisted)
    localStorage.setItem('dessert-wishlist', JSON.stringify(Array.from(newWishlisted)))
  }

  const markAsTried = (dessertId: string, rating?: number, notes?: string) => {
    const newTried = new Map(tried)
    newTried.set(dessertId, { rating, notes })
    setTried(newTried)
    localStorage.setItem('dessert-tried', JSON.stringify(Array.from(newTried.entries())))
  }

  const unmarkAsTried = (dessertId: string) => {
    const newTried = new Map(tried)
    newTried.delete(dessertId)
    setTried(newTried)
    localStorage.setItem('dessert-tried', JSON.stringify(Array.from(newTried.entries())))
  }

  const rateDessert = (dessertId: string, rating: number) => {
    const newTried = new Map(tried)
    const existing = newTried.get(dessertId) || {}
    newTried.set(dessertId, { ...existing, rating })
    setTried(newTried)
    localStorage.setItem('dessert-tried', JSON.stringify(Array.from(newTried.entries())))
  }

  return (
    <DessertContext.Provider
      value={{
        desserts,
        wishlisted,
        tried,
        addToWishlist,
        removeFromWishlist,
        markAsTried,
        unmarkAsTried,
        rateDessert,
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
