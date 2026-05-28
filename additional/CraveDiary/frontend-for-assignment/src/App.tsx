import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DessertProvider } from './context/DessertContext'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import DiscoverPage from './pages/Discover'
import WishlistPage from './pages/Wishlist'
import TriedPage from './pages/Tried'
import ReviewsPage from './pages/Reviews'
import DashboardPage from './pages/Dashboard'
import CoffeePage from './pages/Coffee'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <DessertProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/tried" element={<ProtectedRoute><TriedPage /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/coffee" element={<ProtectedRoute><CoffeePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DessertProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
