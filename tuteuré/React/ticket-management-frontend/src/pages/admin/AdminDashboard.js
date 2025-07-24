import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import StatisticsPage from './StatisticsPage';
import AgenciesPage from './AgenciesPage';
import AgentsPage from './AgentsPage';
import SettingsPage from './SettingsPage';

const AdminDashboard = () => {
  return (
    <Layout userRole="admin">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/statistics" replace />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/agencies" element={<AgenciesPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
