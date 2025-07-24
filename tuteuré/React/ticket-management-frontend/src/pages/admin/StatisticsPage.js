import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const StatisticsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTickets: 0,
    averageWaitTime: 0,
    activeAgents: 0,
    totalAgencies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await apiService.getStatistics();
      // Ensure we have valid data with fallbacks
      const data = response || {};
      setStats({
        totalTickets: data.totalTickets || 0,
        averageWaitTime: data.averageWaitTime || 0,
        activeAgents: data.activeAgents || 0,
        totalAgencies: data.totalAgencies || 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Set default values on error
      setStats({
        totalTickets: 0,
        averageWaitTime: 0,
        activeAgents: 0,
        totalAgencies: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, unit = '', color, icon, onClick }) => (
    <button 
      onClick={onClick}
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer w-full text-left"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${color} rounded-md flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  `${value} ${unit}`
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord - Statistiques</h1>
        <p className="mt-1 text-sm text-gray-600">
          Vue d'ensemble des performances du système de tickets
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total des tickets"
          value={stats.totalTickets}
          color="bg-primary"
          onClick={() => navigate('/admin/tickets')}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        <StatCard
          title="Temps d'attente moyen"
          value={stats.averageWaitTime}
          unit="min"
          color="bg-warning"
          onClick={() => navigate('/admin/statistics')}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Agents actifs"
          value={stats.activeAgents}
          color="bg-success"
          onClick={() => navigate('/admin/agents')}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />

        <StatCard
          title="Total des agences"
          value={stats.totalAgencies}
          color="bg-secondary"
          onClick={() => navigate('/admin/agencies')}
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate('/admin/tickets')}
                  className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Ticket #B00{item} traité par Agent {item}</p>
                    <p className="text-xs text-gray-500">Il y a {item * 5} minutes</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Performance hebdomadaire</h3>
          </div>
          <div className="p-6">
            <button
              onClick={() => navigate('/admin/reports')}
              className="h-64 bg-gray-100 rounded-lg flex items-center justify-center w-full hover:bg-gray-200 transition-colors"
            >
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Graphique des performances</p>
                <p className="text-xs text-gray-400">Cliquez pour voir les rapports détaillés</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
