import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import Discover from "./pages/Discover";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Public layout routes */}
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>

                {/* Protected layout routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/trips/:id" element={<TripDetail />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default App;
