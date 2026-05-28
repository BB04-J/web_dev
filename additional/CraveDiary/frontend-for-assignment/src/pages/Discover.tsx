import { useState, useEffect } from 'react'
import { useDessert, Dessert } from '../context/DessertContext'
import Navigation from '../components/Navigation'
import DessertCard from '../components/DessertCard'
import RecipeDetailsModal from '../components/RecipeDetailsModal'
import { Search, Filter } from 'lucide-react'

const DiscoverPage = () => {
  const { addToWishlist, addToTried, wishlist, tried } = useDessert()
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null)
  const [recommendations, setRecommendations] = useState<Dessert[]>([])
  const [recLoading, setRecLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setRecLoading(true)
        const promises = Array.from({ length: 4 }).map(() =>
          fetch('http://localhost:5000/api/desserts/discover/random').then(res => res.json())
        )
        const results = await Promise.all(promises)
        
        const mapped = results
          .map((data): Dessert | null => {
            if (data.meals && data.meals[0]) {
              const meal = data.meals[0]
              const ingredients: string[] = []
              for (let i = 1; i <= 20; i++) {
                const ing = meal[`strIngredient${i}`]
                if (ing && ing.trim()) {
                  ingredients.push(ing.trim())
                }
              }
              return {
                id: meal.idMeal,
                name: meal.strMeal,
                image: meal.strMealThumb,
                category: meal.strCategory,
                country: meal.strArea,
                instructions: meal.strInstructions,
                youtube: meal.strYoutube || '',
                ingredients,
              }
            }
            return null
          })
          .filter((d): d is Dessert => d !== null)

        // De-duplicate recommendations by ID
        const unique = mapped.filter((item, index, self) =>
          self.findIndex(t => t.id === item.id) === index
        )

        setRecommendations(unique)
      } catch (err) {
        console.error('Failed to fetch recommendations:', err)
      } finally {
        setRecLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        setLoading(true)
        
        let mapped: Dessert[] = []
        
        if (!searchQuery && !selectedCategory && !selectedCountry) {
          // Fetch 8 random desserts concurrently for fresh discoveries on every visit!
          const promises = Array.from({ length: 8 }).map(() =>
            fetch('http://localhost:5000/api/desserts/discover/random').then(res => res.json())
          )
          const results = await Promise.all(promises)
          
          mapped = results
            .map((data): Dessert | null => {
              if (data.meals && data.meals[0]) {
                const meal = data.meals[0]
                const ingredients: string[] = []
                for (let i = 1; i <= 20; i++) {
                  const ing = meal[`strIngredient${i}`]
                  if (ing && ing.trim()) {
                    ingredients.push(ing.trim())
                  }
                }
                return {
                  id: meal.idMeal,
                  name: meal.strMeal,
                  image: meal.strMealThumb,
                  category: meal.strCategory,
                  country: meal.strArea,
                  instructions: meal.strInstructions,
                  youtube: meal.strYoutube || '',
                  ingredients,
                }
              }
              return null
            })
            .filter((d): d is Dessert => d !== null)

          // De-duplicate recommendations by ID
          mapped = mapped.filter((item, index, self) =>
            self.findIndex(t => t.id === item.id) === index
          )
        } else {
          // Standard Search Filter
          let url = `http://localhost:5000/api/desserts/discover/search?search=${searchQuery}`
          if (selectedCategory) {
            url += `&category=${selectedCategory}`
          }
          if (selectedCountry) {
            url += `&country=${selectedCountry}`
          }
          
          const response = await fetch(url)
          const meals = await response.json()
          
          if (meals && Array.isArray(meals)) {
            mapped = meals.map((meal: any) => {
              const ingredients: string[] = []
              for (let i = 1; i <= 20; i++) {
                const ing = meal[`strIngredient${i}`]
                if (ing && ing.trim()) {
                  ingredients.push(ing.trim())
                }
              }
              return {
                id: meal.idMeal,
                name: meal.strMeal,
                image: meal.strMealThumb,
                category: meal.strCategory,
                country: meal.strArea,
                instructions: meal.strInstructions,
                youtube: meal.strYoutube || '',
                ingredients,
              }
            })
          }
        }
        
        setDesserts(mapped)
      } catch (error) {
        console.error('Failed to fetch desserts:', error)
        setDesserts([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchDesserts, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, selectedCountry])

  const filteredDesserts = desserts.filter(d => {
    if (selectedCategory && d.category && d.category.toLowerCase() !== selectedCategory.toLowerCase()) return false
    if (selectedCountry && d.country && d.country.toLowerCase() !== selectedCountry.toLowerCase()) return false
    return true
  })

  const allCategories = [
    'Cake',
    'Cookie',
    'Pie',
    'Pudding',
    'Tart',
    'Ice Cream',
    'Pastry',
    'Mousse',
    'Custard',
    'Donut',
    'Macaron',
    'Cheesecake',
    'Chocolate',
    'Candy',
    'Fruit Dessert'
  ]

  const allCountries = [
    'French',
    'Italian',
    'American',
    'British',
    'Canadian',
    'Chinese',
    'Indian',
    'Japanese',
    'Mexican',
    'Spanish',
    'Turkish',
    'Greek',
    'Belgian',
    'German',
    'Swiss',
    'Austrian'
  ]

  const categories = Array.from(new Set([
    ...allCategories,
    ...desserts.map(d => d.category).filter(Boolean)
  ])).sort()

  const countries = Array.from(new Set([
    ...allCountries,
    ...desserts.map(d => d.country).filter(Boolean)
  ])).sort()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Discover Desserts</h1>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search desserts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desserts Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading desserts...</p>
              </div>
            </div>
          ) : filteredDesserts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No desserts found. Try a different search!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDesserts.map(dessert => {
                const inWishlist = wishlist.some(w => w.id === dessert.id)
                const inTried = tried.some(t => t.id === dessert.id)
                return (
                  <DessertCard
                    key={dessert.id}
                    dessert={dessert}
                    onAddToWishlist={() => addToWishlist(dessert)}
                    onMarkAsTried={() => addToTried(dessert)}
                    isInWishlist={inWishlist}
                    isInTried={inTried}
                    onClick={() => setSelectedDessert(dessert)}
                  />
                )
              })}
            </div>
          )}

          {/* Recommended for You Section at the Bottom */}
          <div className="mt-20 pt-12 border-t border-border/30">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full animate-pulse">
                  Fresh Curations
                </span>
                <h2 className="text-3xl font-serif font-bold text-foreground mt-2">
                  Recommended for You
                </h2>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mt-2 md:mt-0 italic leading-relaxed">
                Unique dessert recipes chosen at random to inspire your culinary exploration on every visit.
              </p>
            </div>

            {recLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">No recommendations found.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map(dessert => {
                  const inWishlist = wishlist.some(w => w.id === dessert.id)
                  const inTried = tried.some(t => t.id === dessert.id)
                  return (
                    <DessertCard
                      key={`rec-${dessert.id}`}
                      dessert={dessert}
                      onAddToWishlist={() => addToWishlist(dessert)}
                      onMarkAsTried={() => addToTried(dessert)}
                      isInWishlist={inWishlist}
                      isInTried={inTried}
                      onClick={() => setSelectedDessert(dessert)}
                    />
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      {selectedDessert && (
        <RecipeDetailsModal
          dessert={selectedDessert}
          onClose={() => setSelectedDessert(null)}
        />
      )}
    </>
  )
}

export default DiscoverPage
