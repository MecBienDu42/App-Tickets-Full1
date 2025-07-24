import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const CallPage = () => {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [nextTicket, setNextTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callHistory, setCallHistory] = useState([]);

  useEffect(() => {
    fetchNextTicket();
    fetchCallHistory();
  }, []);

  const fetchNextTicket = async () => {
    try {
      const response = await apiService.getTicketQueue();
      const waitingTickets = response.data.filter(ticket => ticket.status === 'waiting');
      if (waitingTickets.length > 0) {
        setNextTicket(waitingTickets[0]);
      } else {
        setNextTicket(null);
      }
    } catch (error) {
      console.error('Error fetching next ticket:', error);
    }
  };

  const fetchCallHistory = () => {
    // Mock call history - replace with actual API call
    const mockHistory = [
      { id: 1, number: 'A001', time: '14:30', duration: '5 min', status: 'completed' },
      { id: 2, number: 'A002', time: '14:25', duration: '3 min', status: 'completed' },
      { id: 3, number: 'A003', time: '14:20', duration: '7 min', status: 'completed' },
    ];
    setCallHistory(mockHistory);
  };

  const callNextTicket = async () => {
    if (!nextTicket) return;

    setLoading(true);
    try {
      const response = await apiService.callNextTicket();
      setCurrentTicket(nextTicket);
      setNextTicket(null);
      fetchNextTicket();
      fetchCallHistory();
    } catch (error) {
      console.error('Error calling next ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeCurrentTicket = () => {
    if (currentTicket) {
      setCallHistory([
        {
          id: currentTicket.id,
          number: currentTicket.number,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          duration: '5 min', // Calculate actual duration
          status: 'completed'
        },
        ...callHistory
      ]);
      setCurrentTicket(null);
      fetchNextTicket();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Appeler un client</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gérez les appels des clients en attente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Call Section */}
        <div className="space-y-6">
          {/* Current Ticket */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client actuel</h3>
            {currentTicket ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">#{currentTicket.number}</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentTicket.client_name || 'Client anonyme'}
                </h4>
                <p className="text-gray-600 mb-4">Service: {currentTicket.service_type || 'Standard'}</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={completeCurrentTicket}
                    className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-150"
                  >
                    Terminer
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-150">
                    Mettre en pause
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Aucun client en cours</p>
              </div>
            )}
          </div>

          {/* Next Ticket */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Prochain client</h3>
            {nextTicket ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">#{nextTicket.number}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {nextTicket.client_name || 'Client anonyme'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      En attente depuis {Math.floor((new Date() - new Date(nextTicket.created_at)) / (1000 * 60))} min
                    </p>
                  </div>
                </div>
                <button
                  onClick={callNextTicket}
                  disabled={loading || currentTicket}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )}
                  Appeler
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Aucun client en attente</p>
              </div>
            )}
          </div>
        </div>

        {/* Call History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Historique des appels</h3>
          </div>
          <div className="p-6">
            {callHistory.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Aucun appel aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-4">
                {callHistory.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">#{call.number}</p>
                        <p className="text-xs text-gray-500">{call.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{call.duration}</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success text-green-800">
                        Terminé
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Pause</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Nouveau ticket</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Statistiques</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
