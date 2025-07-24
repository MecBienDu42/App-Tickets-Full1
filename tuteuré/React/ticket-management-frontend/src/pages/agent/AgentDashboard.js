import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import QueuePage from './QueuePage';
import CallPage from './CallPage';
import StatsPage from './StatsPage';

const AgentDashboard = () => {
  return (
    <Layout userRole="agent">
      <Routes>
        <Route path="/" element={<Navigate to="/agent/queue" replace />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Layout>
  );
};

export default AgentDashboard;
