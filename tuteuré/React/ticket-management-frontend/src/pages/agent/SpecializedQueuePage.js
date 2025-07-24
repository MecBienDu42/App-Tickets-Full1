import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import SpecializedTicketsTable from '../../components/common/SpecializedTicketsTable';
import QueueStats from '../../components/common/QueueStats';
import ServiceBadge from '../../components/common/ServiceBadge';

const SpecializedQueuePage = () => {
  const { user } = useAuth();
  const [agentInfo, setAgentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentInfo = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all agents and find the current user's agent record
        const response = await apiService.getAgents();
        const agents = response.data || [];
        
        // Find the agent record for the current user
        const currentAgent = agents.find(agent => agent.user_id === user.id);
        
        if (currentAgent) {
          setAgentInfo({
            id: currentAgent.id,
            service_assigne: currentAgent.service_assigne,
            nom: currentAgent.user?.nom || user.nom,
            prenom: currentAgent.user?.prenom || user.prenom
          });
        } else {
          // Fallback if no agent record found
          setAgentInfo({
            id: user.id,
            service_assigne: 'depot', // Default service
            nom: user.nom || 'Agent',
            prenom: user.prenom || 'Test'
          });
        }
      } catch (error) {
        console.error('Error fetching agent info:', error);
        // Fallback on error
        setAgentInfo({
          id: user.id,
          service_assigne: 'depot',
          nom: user.nom || 'Agent',
          prenom: user.prenom || 'Test'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentInfo();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interface Agent {agentInfo?.service_assigne === 'depot' ? 'Dépôt' : 'Retrait'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Bonjour {agentInfo?.prenom} {agentInfo?.nom}, gérez les tickets de votre service
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ServiceBadge service={agentInfo?.service_assigne} />
              <div className="text-right">
                <div className="text-sm text-gray-500">Agent ID</div>
                <div className="font-medium">{agentInfo?.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats for Agent's Service */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Statistiques temps réel - Service {agentInfo?.service_assigne === 'depot' ? 'Dépôt' : 'Retrait'}
        </h2>
        <QueueStats refreshInterval={15000} />
      </div>

      {/* Agent's Tickets */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Tickets à traiter - Service {agentInfo?.service_assigne === 'depot' ? 'Dépôt' : 'Retrait'}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔄 Actualisation automatique
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Tickets du service {agentInfo?.service_assigne === 'depot' ? 'Dépôt' : 'Retrait'} uniquement. 
            Un seul ticket "En cours" autorisé par agent. Actualisation automatique toutes les 10s.
          </p>
        </div>
        
        <div className="p-6">
          <SpecializedTicketsTable 
            agentId={agentInfo?.id}
            agentService={agentInfo?.service_assigne}
            showFilters={true}
            showActions={true}
            refreshInterval={10000}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          💡 Actions Agent {agentInfo?.service_assigne === 'depot' ? 'Dépôt' : 'Retrait'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span className="text-lg">🔵</span>
            <div>
              <div className="font-medium">Appeler (Bouton Bleu)</div>
              <div>En attente → En cours. Un seul ticket "En cours" autorisé par agent.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-lg">🟢</span>
            <div>
              <div className="font-medium">Terminer (Bouton Vert)</div>
              <div>En cours → Retiré de la file. Service client terminé avec succès.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-lg">🔴</span>
            <div>
              <div className="font-medium">Annuler (Bouton Rouge)</div>
              <div>Marquer client absent. Disponible pour tous les statuts.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializedQueuePage;
