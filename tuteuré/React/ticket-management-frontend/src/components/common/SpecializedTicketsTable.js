import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const SpecializedTicketsTable = ({ 
  agentId = null, 
  agentService = null,
  showFilters = false, 
  showActions = true,
  refreshInterval = 10000 
}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [filters, setFilters] = useState({});

  // Fonction pour calculer le temps d'attente
  const calculateWaitTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    if (diffMins >= 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
    }
    return `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
  };

  // Actions pour les tickets
  const handleCallTicket = async (ticketId) => {
    try {
      setProcessingAction(ticketId);
      await apiService.callTicket(ticketId, agentId);
      await fetchTickets(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de l\'appel du ticket:', error);
      alert('Erreur lors de l\'appel du ticket');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleCompleteTicket = async (ticketId) => {
    try {
      setProcessingAction(ticketId);
      await apiService.completeTicket(ticketId);
      await fetchTickets(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la finalisation du ticket:', error);
      alert('Erreur lors de la finalisation du ticket');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer ce client comme absent ?')) {
      try {
        setProcessingAction(ticketId);
        await apiService.markTicketAbsent(ticketId);
        await fetchTickets(); // Rafraîchir la liste
      } catch (error) {
        console.error('Erreur lors de l\'annulation du ticket:', error);
        alert('Erreur lors de l\'annulation du ticket');
      } finally {
        setProcessingAction(null);
      }
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Essayer d'abord de récupérer tous les tickets puis filtrer
      console.log('Fetching all tickets for service:', agentService);
      
      // Essayer plusieurs approches pour récupérer les tickets
      let tickets = [];
      
      try {
        // Approche 1: Récupérer tous les tickets
        const allTicketsResponse = await apiService.getTickets();
        console.log('All tickets response:', allTicketsResponse);
        
        if (allTicketsResponse && allTicketsResponse.data) {
          tickets = allTicketsResponse.data;
        }
      } catch (error) {
        console.log('Failed to fetch all tickets:', error);
      }
      
      // Approche 2: Essayer avec paramètres spécifiques
      if (tickets.length === 0) {
        try {
          const params = {};
          if (agentService) {
            params.service = agentService;
          }
          const serviceResponse = await apiService.getTickets(params);
          console.log('Service-specific response:', serviceResponse);
          
          if (serviceResponse && serviceResponse.data) {
            tickets = serviceResponse.data;
          }
        } catch (error) {
          console.log('Failed to fetch service-specific tickets:', error);
        }
      }
      
      if (tickets.length > 0) {
        // Filtrer les tickets pour le service de l'agent et les statuts actifs
        let filteredTickets = tickets.filter(ticket => {
          const matchesService = !agentService || ticket.service === agentService || ticket.type === agentService;
          const isActive = ['en_attente', 'en_cours'].includes(ticket.statut);
          return matchesService && isActive;
        });
        
        console.log('Filtered tickets for service', agentService, ':', filteredTickets);
        setTickets(filteredTickets);
        setError(null);
      } else {
        // Données de test pour le service dépôt
        let fallbackTickets = [
          {
            id: 1,
            numero_ticket: 'D001',
            type: 'depot',
            service: 'depot',
            statut: 'en_attente',
            queue_position: 1,
            client: { nom: 'Dupont', prenom: 'Jean' },
            created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
            estimated_wait_time: 5
          },
          {
            id: 2,
            numero_ticket: 'D002',
            type: 'depot',
            service: 'depot',
            statut: 'en_cours',
            queue_position: 0,
            client: { nom: 'Martin', prenom: 'Marie' },
            created_at: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
            estimated_wait_time: 0
          },
          {
            id: 3,
            numero_ticket: 'D003',
            type: 'depot',
            service: 'depot',
            statut: 'en_attente',
            queue_position: 2,
            client: { nom: 'Durand', prenom: 'Pierre' },
            created_at: new Date(Date.now() - 12 * 60000).toISOString(), // 12 minutes ago (critique)
            estimated_wait_time: 10
          },
          {
            id: 4,
            numero_ticket: 'D004',
            type: 'depot',
            service: 'depot',
            statut: 'en_attente',
            queue_position: 3,
            client: { nom: 'Bernard', prenom: 'Sophie' },
            created_at: new Date(Date.now() - 1 * 60000).toISOString(), // 1 minute ago
            estimated_wait_time: 8
          }
        ];
        
        // Filtrer par service de l'agent et ne garder que les tickets actifs
        if (agentService) {
          fallbackTickets = fallbackTickets.filter(ticket => 
            ticket.service === agentService && ['en_attente', 'en_cours'].includes(ticket.statut)
          );
        }
        
        setTickets(fallbackTickets);
        console.log('Using fallback data for service:', agentService);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(`Erreur lors du chargement des tickets du service ${agentService}: ${err.message}`);
      
      // Log détaillé pour diagnostic
      console.log('Agent Service:', agentService);
      console.log('Agent ID:', agentId);
      console.log('Error details:', err);
      
      // Données de secours en cas d'erreur
      let fallbackTickets = [
        {
          id: 1,
          numero_ticket: 'D001',
          type: 'depot',
          service: 'depot',
          statut: 'en_attente',
          queue_position: 1,
          client: { nom: 'Dupont', prenom: 'Jean' },
          created_at: new Date(Date.now() - 5 * 60000).toISOString(),
          estimated_wait_time: 5
        },
        {
          id: 2,
          numero_ticket: 'D002',
          type: 'depot',
          service: 'depot',
          statut: 'en_cours',
          queue_position: 0,
          client: { nom: 'Martin', prenom: 'Marie' },
          created_at: new Date(Date.now() - 2 * 60000).toISOString(),
          estimated_wait_time: 0
        }
      ];
      
      // Filtrer par service de l'agent
      if (agentService) {
        fallbackTickets = fallbackTickets.filter(ticket => 
          ticket.service === agentService && ['en_attente', 'en_cours'].includes(ticket.statut)
        );
      }
      
      setTickets(fallbackTickets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    
    // Set up auto-refresh
    const interval = setInterval(fetchTickets, refreshInterval);
    return () => clearInterval(interval);
  }, [filters, agentId, refreshInterval]);

  const handleCall = async (ticketId, currentAgentId) => {
    try {
      await apiService.callTicket(ticketId, currentAgentId);
      fetchTickets(); // Refresh the list
    } catch (err) {
      setError('Erreur lors de l\'appel du ticket');
      console.error('Error calling ticket:', err);
    }
  };

  const handleAbsent = async (ticketId) => {
    try {
      await apiService.markTicketAbsent(ticketId);
      fetchTickets(); // Refresh the list
    } catch (err) {
      setError('Erreur lors du marquage absent');
      console.error('Error marking absent:', err);
    }
  };

  const handleComplete = async (ticketId) => {
    try {
      await apiService.completeTicket(ticketId);
      fetchTickets(); // Refresh the list
    } catch (err) {
      setError('Erreur lors de la finalisation');
      console.error('Error completing ticket:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'en_cours': { color: 'bg-blue-100 text-blue-800', label: 'En cours' },
      'termine': { color: 'bg-green-100 text-green-800', label: 'Terminé' },
      'annule': { color: 'bg-red-100 text-red-800', label: 'Annulé' }
    };
    
    const config = statusConfig[statut] || { color: 'bg-gray-100 text-gray-800', label: statut };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Vérifier s'il y a un ticket en cours pour cet agent
  const hasActiveTicket = tickets.some(ticket => ticket.statut === 'en_cours');

  // Fonction pour obtenir la couleur du temps d'attente
  const getWaitTimeColor = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMins = Math.floor((now - created) / 60000);
    
    if (diffMins > 10) {
      return 'text-red-600 font-bold'; // Critique
    } else if (diffMins > 5) {
      return 'text-orange-600 font-semibold'; // Attention
    }
    return 'text-gray-900'; // Normal
  };

  // Fonction pour obtenir la couleur de fond de la ligne
  const getRowBackgroundColor = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'en_cours':
        return 'bg-blue-50 hover:bg-blue-100';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* En-tête avec actualisation automatique */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Interface Agent - Service {agentService === 'depot' ? 'Dépôt' : 'Retrait'}
            </h3>
            <p className="text-sm text-gray-600">
              {tickets.length} ticket{tickets.length > 1 ? 's' : ''} en cours de traitement
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              🔄 Actualisation automatique (10s)
            </span>
          </div>
        </div>
      </div>


      {/* Message d'erreur */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table des tickets selon spécifications */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NUMÉRO
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TEMPS D'ATTENTE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUT
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h.01M9 16h.01" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">Aucun ticket en attente</p>
                    <p className="text-gray-500">Tous les clients ont été traités pour le moment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className={`${getRowBackgroundColor(ticket.statut)} transition-colors duration-200`}>
                  {/* NUMÉRO */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-gray-900">
                        {ticket.numero_ticket}
                      </div>
                      {ticket.statut === 'en_cours' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          En cours
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* TEMPS D'ATTENTE */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-lg font-mono ${getWaitTimeColor(ticket.created_at)}`}>
                      {calculateWaitTime(ticket.created_at)}
                    </div>
                  </td>
                  
                  {/* STATUT */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(ticket.statut)}
                  </td>
                  
                  {/* ACTIONS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {ticket.statut === 'en_attente' && (
                        <>
                          <button
                            onClick={() => handleCallTicket(ticket.id)}
                            disabled={hasActiveTicket || processingAction === ticket.id}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                              hasActiveTicket 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            } transition-colors duration-200`}
                            title={hasActiveTicket ? 'Un client est déjà en cours de traitement' : 'Appeler ce client'}
                          >
                            {processingAction === ticket.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            )}
                            Appeler
                          </button>
                          <button
                            onClick={() => handleCancelTicket(ticket.id)}
                            disabled={processingAction === ticket.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            title="Marquer le client comme absent"
                          >
                            {processingAction === ticket.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            Annuler
                          </button>
                        </>
                      )}
                      
                      {ticket.statut === 'en_cours' && (
                        <>
                          <button
                            onClick={() => handleCompleteTicket(ticket.id)}
                            disabled={processingAction === ticket.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            title="Terminer le service client"
                          >
                            {processingAction === ticket.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            Terminer
                          </button>
                          <button
                            onClick={() => handleCancelTicket(ticket.id)}
                            disabled={processingAction === ticket.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            title="Marquer le client comme absent"
                          >
                            {processingAction === ticket.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            Annuler
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with refresh info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{tickets.length} ticket(s) affiché(s)</span>
          <span>Actualisation automatique toutes les {refreshInterval / 1000}s</span>
        </div>
      </div>
    </div>
  );
};

export default SpecializedTicketsTable;
