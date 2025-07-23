import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import CameraPage from './pages/CameraPage';
import HistoryPage from './pages/HistoryPage';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {isAuthenticated && <SidebarMenu />}

        <main className="flex-1 overflow-auto">
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
              path="*"
              element={<Navigate to={isAuthenticated ? "/camera" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
