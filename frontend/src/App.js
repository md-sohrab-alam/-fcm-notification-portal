import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SendNotification from './pages/SendNotification';
import TopicManagement from './pages/TopicManagement';
import HistoryPage from './pages/History';

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/send-notification" element={<SendNotification />} />
            <Route path="/topic-management" element={<TopicManagement />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App; 