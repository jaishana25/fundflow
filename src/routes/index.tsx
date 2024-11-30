import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChatPage } from '../pages/ChatPage';
import { TransferHistoryPage } from '../pages/TransferHistoryPage';
import { SettingsPage } from '../pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/history" element={<TransferHistoryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}