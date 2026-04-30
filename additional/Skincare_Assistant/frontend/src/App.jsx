import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoutinePage from './pages/RoutinePage';
import ProfilePage from './pages/ProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';
import IngredientCheckerPage from './pages/IngredientCheckerPage';
import DashboardPage from './pages/DashboardPage';
import SuitabilityCheckerPage from './pages/SuitabilityCheckerPage';
import RoutineGuidancePage from './pages/RoutineGuidancePage';
import WeeklyRoutinePage from './pages/WeeklyRoutinePage';

// Components
import Navbar from './components/common/Navbar';
import Layout from './components/common/Layout';

// A simple component to protect routes that require login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Top Navbar */}
        <Route path="/" element={
          <div className="page-wrapper"><Navbar /><main className="container"><HomePage /></main></div>
        } />
        <Route path="/login" element={
          <div className="page-wrapper"><Navbar /><main className="container"><LoginPage /></main></div>
        } />
        <Route path="/signup" element={
          <div className="page-wrapper"><Navbar /><main className="container"><SignupPage /></main></div>
        } />
        
        {/* Protected Routes with Sidebar Layout */}
        <Route path="/routines" element={
          <ProtectedRoute>
            <Layout><RoutinePage /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/recommendations" element={
          <ProtectedRoute>
            <Layout><RecommendationsPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/ingredients" element={
          <ProtectedRoute>
            <Layout><IngredientCheckerPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/product-checker" element={
          <ProtectedRoute>
            <Layout><SuitabilityCheckerPage /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/guidance" element={
          <ProtectedRoute>
            <Layout><RoutineGuidancePage /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/weekly-planner" element={
          <ProtectedRoute>
            <Layout><WeeklyRoutinePage /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
