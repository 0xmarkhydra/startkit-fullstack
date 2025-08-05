import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { AuthPage } from './pages/AuthPage';
import { ChatPage } from './pages/ChatPage';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/chat" />;
};

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app start
    console.log('🔍 [App] [useEffect] initializing application auth');
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<PublicRoute><Navigate to="/auth/login" /></PublicRoute>} />

          <Route path="/auth/login" element={<PublicRoute><AuthPage /></PublicRoute>} />

          <Route path="/auth/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
          
          {/* Protected routes */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/chat" />} 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to="/chat" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
