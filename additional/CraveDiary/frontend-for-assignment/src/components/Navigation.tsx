import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Home, Search, Heart, Star, Users, BarChart3, LogOut, Coffee } from 'lucide-react'
import { useState } from 'react'

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path
  const isCoffeePage = location.pathname === '/coffee'

  return (
    <nav className={`sticky top-4 z-50 mx-auto w-[92%] md:w-[75%] shadow-lg transition-all duration-1000 rounded-2xl md:rounded-full border ${
      isCoffeePage 
        ? "coffee-navbar border-white/10" 
        : "bg-card/95 backdrop-blur-md border-border/80"
    }`}>
      <div className="px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-foreground font-serif text-2.5xl font-bold hover:text-primary transition-all duration-300 group">
            <img 
              src="/logo.png" 
              alt="CraveDiary Doodle Logo" 
              className="w-9 h-9 rounded-xl object-cover border border-border/20 shadow-sm bg-[#EBE3D5] p-0.5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"
            />
            <span className="tracking-tight text-foreground group-hover:text-primary transition-colors">
              Crave<span className="text-primary font-normal italic">Diary</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/coffee"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/coffee')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Coffee className="w-4 h-4" />
                Coffee Corner
              </Link>
              <Link
                to="/discover"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/discover')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Search className="w-4 h-4" />
                Discover
              </Link>
              <Link
                to="/wishlist"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/wishlist')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Link
                to="/tried"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/tried')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Star className="w-4 h-4" />
                Tried
              </Link>
              <Link
                to="/reviews"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/reviews')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Users className="w-4 h-4" />
                Reviews
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-foreground border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  to="/coffee"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/coffee')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  Coffee Corner
                </Link>
                <Link
                  to="/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/discover')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Discover
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/wishlist')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
                <Link
                  to="/tried"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/tried')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Tried
                </Link>
                <Link
                  to="/reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/reviews')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Reviews
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg mb-2 flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 mb-2 text-foreground border border-border rounded-lg hover:bg-secondary transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
