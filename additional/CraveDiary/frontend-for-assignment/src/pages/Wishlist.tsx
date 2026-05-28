import { useState } from 'react'
import { useDessert, Dessert } from '../context/DessertContext'
import Navigation from '../components/Navigation'
import DessertCard from '../components/DessertCard'
import RecipeDetailsModal from '../components/RecipeDetailsModal'
import { Heart } from 'lucide-react'

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToTried } = useDessert()
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            <h1 className="text-4xl font-serif font-bold text-foreground">My Wishlist</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No desserts yet</h2>
              <p className="text-muted-foreground mb-8">Start adding desserts to your wishlist!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map(dessert => (
                <div key={dessert.id} className="relative">
                  <DessertCard
                    dessert={dessert}
                    onAddToWishlist={() => removeFromWishlist(dessert.id)}
                    onMarkAsTried={() => {
                      addToTried(dessert)
                      removeFromWishlist(dessert.id)
                    }}
                    isInWishlist={true}
                    onClick={() => setSelectedDessert(dessert)}
                  />
                </div>
              ))}
            </div>
          )}
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

export default WishlistPage
