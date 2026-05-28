import { useDessert } from '../context/DessertContext'
import Navigation from '../components/Navigation'
import { Users, BarChart3 } from 'lucide-react'

const ReviewsPage = () => {
  const { tried, ratings } = useDessert()

  const ratedDesserts = tried
    .map(d => ({
      ...d,
      rating: ratings[d.id] || 0,
    }))
    .filter(d => d.rating > 0)
    .sort((a, b) => b.rating - a.rating)

  const avgRating = ratedDesserts.length > 0
    ? (ratedDesserts.reduce((sum, d) => sum + d.rating, 0) / ratedDesserts.length).toFixed(1)
    : 0

  const ratingDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ratedDesserts.forEach(d => {
    if (d.rating >= 1 && d.rating <= 10) {
      ratingDistribution[d.rating - 1]++
    }
  })

  const topRated = ratedDesserts.slice(0, 3)
  const bottomRated = ratedDesserts.slice(-3).reverse()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">Reviews & Statistics</h1>
          </div>

          {ratedDesserts.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No reviews yet</h2>
              <p className="text-muted-foreground mb-8">Rate some desserts to see your reviews here!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Statistics */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground">Total Rated</h3>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{ratedDesserts.length}</p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-accent" />
                    <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{avgRating}/10</p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground">Highest Rated</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary">{topRated[0]?.rating || 0}/10</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Rating Distribution</h2>
                <div className="space-y-3">
                  {ratingDistribution.map((count, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="w-12 text-sm font-medium text-foreground text-right">{idx + 1}</span>
                      <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${count > 0 ? (count / Math.max(...ratingDistribution)) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-sm font-medium text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Rated */}
              {topRated.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Top 3 Favorites</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {topRated.map((dessert, idx) => (
                      <div key={dessert.id} className="bg-secondary rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <span className="text-2xl font-bold text-primary">#{idx + 1}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{dessert.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{dessert.rating}</span>
                          <span className="text-sm text-muted-foreground">/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Ratings */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">All Reviews</h2>
                <div className="space-y-3">
                  {ratedDesserts.map(dessert => (
                    <div key={dessert.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-muted transition-colors">
                      <span className="font-medium text-foreground line-clamp-1">{dessert.name}</span>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="text-sm text-muted-foreground">Category: {dessert.category}</span>
                        <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full font-bold text-sm">
                          {dessert.rating}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default ReviewsPage
