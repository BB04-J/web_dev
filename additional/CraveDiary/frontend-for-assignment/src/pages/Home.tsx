import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navigation from '../components/Navigation'
import RecipeDetailsModal from '../components/RecipeDetailsModal'
import { Dessert } from '../context/DessertContext'
import { Cake, Heart, Star, Users, Coffee, HelpCircle, ArrowRight } from 'lucide-react'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null)
  const [randomLoading, setRandomLoading] = useState(false)

  const handlePickRandom = async () => {
    try {
      setRandomLoading(true)
      const res = await fetch('http://localhost:5000/api/desserts/discover/random')
      const data = await res.json()
      if (data.meals && data.meals[0]) {
        const meal = data.meals[0]
        const mapped: Dessert = {
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          category: meal.strCategory,
          country: meal.strArea,
          instructions: meal.strInstructions,
          youtube: meal.strYoutube,
          ingredients: [
            meal.strIngredient1,
            meal.strIngredient2,
            meal.strIngredient3,
            meal.strIngredient4,
            meal.strIngredient5,
            meal.strIngredient6,
            meal.strIngredient7,
            meal.strIngredient8,
            meal.strIngredient9,
            meal.strIngredient10,
            meal.strIngredient11,
            meal.strIngredient12,
            meal.strIngredient13,
            meal.strIngredient14,
            meal.strIngredient15,
            meal.strIngredient16,
            meal.strIngredient17,
            meal.strIngredient18,
            meal.strIngredient19,
            meal.strIngredient20,
          ].filter(Boolean)
        }
        setSelectedDessert(mapped)
      }
    } catch (err) {
      console.error('Failed to pick random dessert:', err)
    } finally {
      setRandomLoading(false)
    }
  }

  const coffeeCornerDrinks = [
    {
      name: 'Caramel Latte Macchiato',
      emoji: '☕',
      description: 'Velvety steamed milk with rich espresso shot, topped with sweet caramel grid drizzle.',
      ingredients: 'Steamed Milk, Espresso, Caramel Sauce',
      temp: 'Hot / Iced',
      image: '/caramel_latte.png'
    },
    {
      name: 'Cozy Dark Mocha',
      emoji: '🍫',
      description: 'Warm, chocolatey fusion of robust espresso, dark cocoa sauce, and velvety foam.',
      ingredients: 'Espresso, Cocoa Powder, Steamed Milk',
      temp: 'Hot Only',
      image: '/dark_mocha.png'
    },
    {
      name: 'Vanilla Sweet Cream Cold Brew',
      emoji: '🥛',
      description: 'Slow-steeped cold brew dessert-coffee sweetened with vanilla syrup and topped with milk foam.',
      ingredients: 'Cold Brew Coffee, Vanilla Syrup, Cream',
      temp: 'Iced Only',
      image: '/cold_brew.png'
    },
    {
      name: 'Gelato Espresso Affogato',
      emoji: '🍦',
      description: 'A scoop of premium vanilla bean gelato "drowned" in a hot, double shot of espresso.',
      ingredients: 'Vanilla Gelato, Fresh Hot Espresso Shot',
      temp: 'Warm Special',
      image: '/affogato.png'
    }
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {isAuthenticated ? (
          // Authenticated Home
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Main Welcome Hero */}
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-serif font-bold text-foreground mb-4">
                Welcome Back
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Continue exploring the world of delicious desserts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/discover"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
                >
                  Start Discovering
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
                >
                  View Dashboard
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Link to="/discover" className="group">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all cursor-pointer h-full">
                  <div className="mb-4 text-primary group-hover:scale-110 transition-transform inline-block">
                    <Cake className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Discover Desserts</h3>
                  <p className="text-sm text-muted-foreground">Explore thousands of delicious desserts from around the world</p>
                </div>
              </Link>

              <Link to="/wishlist" className="group">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all cursor-pointer h-full">
                  <div className="mb-4 text-primary group-hover:scale-110 transition-transform inline-block">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Your Wishlist</h3>
                  <p className="text-sm text-muted-foreground">Save your favorite desserts for later</p>
                </div>
              </Link>

              <Link to="/tried" className="group">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all cursor-pointer h-full">
                  <div className="mb-4 text-primary group-hover:scale-110 transition-transform inline-block">
                    <Star className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Tried & Rated</h3>
                  <p className="text-sm text-muted-foreground">Track desserts you&apos;ve tried and rate them</p>
                </div>
              </Link>

              <Link to="/reviews" className="group">
                <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all cursor-pointer h-full">
                  <div className="mb-4 text-primary group-hover:scale-110 transition-transform inline-block">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Community Reviews</h3>
                  <p className="text-sm text-muted-foreground">See what other dessert lovers think</p>
                </div>
              </Link>
            </div>

            {/* Interactive Random Dessert Picker Hero Card */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between hover:border-primary transition-all shadow-lg text-center items-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner animate-bounce">
                    🎲
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                    What should I try today?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
                    Feeling indecisive about your sweet cravings? Let our magic picker choose a random dessert recommendation for you instantly!
                  </p>
                </div>
                <button
                  onClick={handlePickRandom}
                  disabled={randomLoading}
                  className="w-full max-w-xs py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {randomLoading ? 'Picking for you...' : 'Pick a Random Dessert! 🎲'}
                </button>
              </div>
            </div>

          </div>
        ) : (
          // Landing Page
          <div className="flex flex-col min-h-screen bg-background">
            {/* Elegant Hero Section with dynamic radial lighting */}
            <div className="relative overflow-hidden px-4 md:px-8 py-20 lg:py-32 border-b border-border/20">
              {/* Backlight effect */}
              <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-radial from-accent/10 via-transparent to-transparent blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 top-1/3 w-[300px] h-[300px] bg-radial from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Text Content */}
                <div className="lg:col-span-7 text-left flex flex-col justify-center">
                  <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-4 bg-primary/10 px-3 py-1.5 rounded-full w-fit animate-pulse">
                    A Culinary Journal
                  </span>
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
                    Crave the Extraordinary. <br />
                    <span className="text-primary italic">Document the Divine.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                    Step into an elegant diary dedicated to the art of fine pastry and coffee pairings. Discover authenticated recipes from across the globe, curate your wishlist, rate gourmet creations, and catalog your sweet experiences.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-10 w-fit">
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-[#52342a] transition-all font-semibold text-base hover:shadow-lg shadow-primary/20 text-center flex items-center justify-center gap-2 group"
                    >
                      Embark on the Journey <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-transparent text-foreground border border-border rounded-xl hover:bg-card/60 transition-all font-semibold text-base text-center"
                    >
                      Open Diary Logs
                    </Link>
                  </div>

                  {/* High Trust Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/30 max-w-lg">
                    <div>
                      <div className="text-3xl font-extrabold font-serif text-primary tracking-tight">1,200+</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Exquisite Recipes</div>
                    </div>
                    <div>
                      <div className="text-3xl font-extrabold font-serif text-primary tracking-tight">48+</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Global Regions</div>
                    </div>
                    <div>
                      <div className="text-3xl font-extrabold font-serif text-primary tracking-tight">100%</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Free to Curate</div>
                    </div>
                  </div>
                </div>

                {/* Right Visual Content (Realistic Chocolate Tiramisu Card in luxury frame) */}
                <div className="lg:col-span-5 flex justify-center items-center">
                  <div className="relative w-full max-w-sm">
                    {/* Glowing golden backing ring */}
                    <div className="absolute -inset-4 bg-radial from-accent/20 to-transparent blur-2xl rounded-full animate-float-cozy"></div>

                    {/* Editorial Pinterest Portrait Frame */}
                    <div className="relative bg-card p-5 pb-8 rounded-[28px] border border-border/30 shadow-2xl transition-all duration-700 hover:rotate-1 hover:scale-[1.02] dessert-card-3d w-full group">
                      <div className="overflow-hidden rounded-[20px] bg-[#EBE3D5] aspect-[4/5] relative flex items-center justify-center">
                        <img 
                          src="/tiramisu.png" 
                          alt="Pinterest chocolate tiramisu pastry slice" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#291C0E]/40 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-4 text-[9px] font-extrabold text-white/90 tracking-widest uppercase bg-black/50 px-2.5 py-1 rounded backdrop-blur-[2px] border border-white/15">
                          PATISSERIE DE LUXE
                        </span>
                      </div>
                      
                      {/* Typographic Tag */}
                      <div className="mt-5 text-left pl-1">
                        <span className="text-[9px] font-extrabold tracking-[0.2em] text-primary/80 uppercase">L’ARTISAN CHOICE</span>
                        <h4 className="text-xl font-serif font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                          Classic Tiramisu
                        </h4>
                        <p className="text-xs text-muted-foreground mt-2 font-sans italic leading-relaxed">
                          Layered with premium espresso-soaked ladyfingers, rich mascarpone whipped cream, and finished with a dusting of fine dark cocoa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust and Social Proof Banner */}
            <div className="py-8 border-b border-border/20 bg-card/20 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-6">
                  Trusted by Sweet Connoisseurs & Fine Baking Houses
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-65 grayscale hover:opacity-90 hover:grayscale-0 transition-all duration-500 text-sm font-semibold text-foreground">
                  <span className="text-base font-serif tracking-wider">LE CORDON BLEU</span>
                  <span className="text-lg font-sans font-black tracking-widest">SAVEUR</span>
                  <span className="text-base font-serif italic font-bold">bon appétit</span>
                  <span className="text-base font-sans font-bold tracking-widest">MICHELIN GUIDE</span>
                  <span className="text-lg font-serif font-medium">PASTRY ART</span>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-background py-24 px-4 relative overflow-hidden">
              {/* Ambient glows */}
              <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                    Artisanal Experience
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mt-4 mb-5">
                    Features That Delight The Senses
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    CraveDiary combines culinary structure with beautiful visual curation. Our diary framework is designed to elevate your appreciation of sweet craftsmanship.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-all duration-500 group-hover:scale-110"></div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Cake className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3">Curated Patisserie Index</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Search through thousands of curated international recipes by country, category, or ingredients. Instantly view step-by-step baking procedures.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full transition-all duration-500 group-hover:scale-110"></div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3">Personal Culinary Wishlist</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Save your favorite pastry discoveries and plan your next baking adventure. Keep a neat visual record of items you can't wait to sample.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="group bg-card p-8 rounded-2xl border border-border/40 hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-bl-full transition-all duration-500 group-hover:scale-110"></div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3">Tried & Rated Log</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Log the pastries you have made or tasted. Rate them with detailed flavor attributes, post community reviews, and track your dessert journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Featured Dessert Showcase */}
            <div className="py-20 bg-card/30 border-t border-border/20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase">Weekly Selections</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-2">
                      Featured Pastry & Coffee Pairings
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-md mt-4 md:mt-0 leading-relaxed">
                    A carefully curated combination of luxury single-origin coffees and fine artisan desserts selected by our global sensory panel.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-background rounded-2xl border border-border/30 overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src="/caramel_latte.png" alt="Caramel Latte Macchiato" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded">
                        COFFEE CORNER
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-serif font-bold text-lg text-foreground">Caramel Latte Macchiato</h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Velvety steamed milk with rich espresso shot, topped with sweet caramel grid drizzle.
                      </p>
                    </div>
                  </div>

                  <div className="bg-background rounded-2xl border border-border/30 overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src="/tiramisu.png" alt="Chocolate Tiramisu" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded">
                        PASTRY SELECTION
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-serif font-bold text-lg text-foreground">Classic Chocolate Tiramisu</h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Perfect balance of coffee-infused layers with authentic Italian mascarpone and dark cocoa.
                      </p>
                    </div>
                  </div>

                  <div className="bg-background rounded-2xl border border-border/30 overflow-hidden group hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src="/affogato.png" alt="Gelato Espresso Affogato" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded">
                        COFFEE CORNER
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-serif font-bold text-lg text-foreground">Gelato Espresso Affogato</h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        A scoop of premium vanilla bean gelato "drowned" in a hot, double shot of robust espresso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/15 border-t border-border/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-accent/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Exclusive Access</span>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-foreground mt-3 mb-6 leading-tight">
                  Ready to Start Your Dessert Adventure?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join a sophisticated global collective of patisserie enthusiasts, home chefs, and flavor connoisseurs. Explore detailed logs, bookmark recipe journals, and share sweet insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-[#52342a] transition-all hover:shadow-lg text-center"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-10 py-4 bg-transparent text-foreground border border-border hover:bg-card/60 transition-all font-semibold rounded-xl text-center"
                  >
                    Open Diary Logs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default HomePage
