import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CameraPage from './pages/CameraPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import PrivateRoute from './components/PrivateRoute';
import BottomNavBar from './components/BottomNavBar';

export default function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUsername('user');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setHistory([]);
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-auto pb-16">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/camera" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/camera"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CameraPage
                    onCapture={(src) => setHistory([src, ...history])}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <HistoryPage history={history} />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <UserPage onLogout={handleLogout} username={username} />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/camera" : "/login"} replace />}
            />
          </Routes>
        </main>

        {isAuthenticated && <BottomNavBar />}
      </div>
    </BrowserRouter>
  );
}
