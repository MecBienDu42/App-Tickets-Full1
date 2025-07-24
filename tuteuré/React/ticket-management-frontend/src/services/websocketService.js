// WebSocket service for real-time updates

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
  }

  connect() {
    try {
      const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000';
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.authenticate();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  authenticate() {
    const token = localStorage.getItem('token');
    if (token && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send({
        type: 'auth',
        token: token
      });
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    // Notify all listeners for this message type
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      if (this.listeners.has(eventType)) {
        this.listeners.get(eventType).delete(callback);
      }
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Specific methods for ticket system events
  subscribeToQueueUpdates(callback) {
    return this.subscribe('queue_update', callback);
  }

  subscribeToTicketCalls(callback) {
    return this.subscribe('ticket_call', callback);
  }

  subscribeToNewTickets(callback) {
    return this.subscribe('new_ticket', callback);
  }

  subscribeToAgentStatus(callback) {
    return this.subscribe('agent_status', callback);
  }

  // Send ticket-related events
  joinAgencyRoom(agencyId) {
    this.send({
      type: 'join_agency',
      agency_id: agencyId
    });
  }

  leaveAgencyRoom(agencyId) {
    this.send({
      type: 'leave_agency',
      agency_id: agencyId
    });
  }

  updateAgentStatus(status) {
    this.send({
      type: 'agent_status_update',
      status: status
    });
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
