import { useDessert } from '../context/DessertContext'
import { useAuth } from '../context/AuthContext'
import Navigation from '../components/Navigation'
import { BarChart3, Heart, Star, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const { wishlist, tried, ratings, getDessertsByRating } = useDessert()
  const { user } = useAuth()

  const topFavorites = getDessertsByRating()
  const avgRating =
    tried.length > 0
      ? (tried.reduce((sum, d) => sum + (ratings[d.id] || 0), 0) / tried.length).toFixed(1)
      : 0

  const ratedCount = Object.keys(ratings).length
  const completionRate = tried.length > 0 ? ((ratedCount / tried.length) * 100).toFixed(0) : 0

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.username}! 👋</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Wishlist</span>
                <Heart className="w-5 h-5 text-primary" fill="currentColor" />
              </div>
              <p className="text-3xl font-bold text-foreground">{wishlist.length}</p>
              <p className="text-xs text-muted-foreground mt-1">items saved</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Tried</span>
                <Star className="w-5 h-5 text-accent" fill="currentColor" />
              </div>
              <p className="text-3xl font-bold text-foreground">{tried.length}</p>
              <p className="text-xs text-muted-foreground mt-1">desserts tried</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Average Rating</span>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{avgRating}</p>
              <p className="text-xs text-muted-foreground mt-1">out of 10</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Completion</span>
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">rated of tried</p>
            </div>
          </div>

          {/* Top 3 Favorites */}
          {topFavorites.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-primary" fill="currentColor" />
                <h2 className="text-2xl font-serif font-bold text-foreground">Your Top 3 Favorites</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {topFavorites.map((dessert, idx) => (
                  <div
                    key={dessert.id}
                    className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6 hover:border-primary transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl font-bold text-primary">#{idx + 1}</div>
                      <Star className="w-6 h-6 text-primary" fill="currentColor" />
                    </div>

                    {dessert.image && (
                      <img
                        src={dessert.image}
                        alt={dessert.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}

                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                      {dessert.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4">
                      {dessert.category && dessert.category}
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">{dessert.rating}</span>
                      <span className="text-muted-foreground">/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Quick Actions</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/discover"
                className="p-6 bg-secondary rounded-lg hover:border-primary border border-border transition-all text-center"
              >
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-semibold text-foreground mb-1">Discover More</h3>
                <p className="text-sm text-muted-foreground">Find new desserts</p>
              </Link>

              <Link
                to="/wishlist"
                className="p-6 bg-secondary rounded-lg hover:border-primary border border-border transition-all text-center"
              >
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="font-semibold text-foreground mb-1">View Wishlist</h3>
                <p className="text-sm text-muted-foreground">{wishlist.length} items</p>
              </Link>

              <Link
                to="/tried"
                className="p-6 bg-secondary rounded-lg hover:border-primary border border-border transition-all text-center"
              >
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-semibold text-foreground mb-1">View Tried</h3>
                <p className="text-sm text-muted-foreground">{tried.length} tried</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default DashboardPage
