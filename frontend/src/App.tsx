// frontend/src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import CameraPage from './pages/CameraPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const [page, setPage] = useState<'camera' | 'history'>('camera');
  const [history, setHistory] = useState<string[]>([]);
  const handleCapture = (src: string) => {
    setHistory(prev => [src, ...prev]);
  };
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <SidebarMenu />

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route
              path="/camera"
              element={
                <CameraPage
                  onCapture={(src) => setHistory([src, ...history])}
                />
              }
            />
            <Route
              path="/history"
              element={<HistoryPage history={history} />}
            />
            <Route path="*" element={<Navigate to="/camera" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
/*
import React from 'react';
import CameraView from './components/CameraView';
import CameraFeed from "./components/CameraFeed";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <CameraFeed />
    </div>
  );
}*/