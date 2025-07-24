// Notification utilities for the ticket management system

/**
 * Request notification permission from the user
 * @returns {Promise<string>} Permission status
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

/**
 * Show a browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
};

/**
 * Show notification for new ticket
 * @param {Object} ticket - Ticket object
 */
export const notifyNewTicket = (ticket) => {
  showNotification('Nouveau ticket', {
    body: `Ticket #${ticket.number} ajouté à la file d'attente`,
    icon: '/favicon.ico',
    tag: 'new-ticket'
  });
};

/**
 * Show notification for ticket call
 * @param {Object} ticket - Ticket object
 */
export const notifyTicketCall = (ticket) => {
  showNotification('Appel de ticket', {
    body: `Ticket #${ticket.number} - Veuillez vous présenter au guichet`,
    icon: '/favicon.ico',
    tag: 'ticket-call',
    requireInteraction: true
  });
};

/**
 * Show notification for queue update
 * @param {number} position - Current position in queue
 * @param {number} waitTime - Estimated wait time
 */
export const notifyQueueUpdate = (position, waitTime) => {
  showNotification('Mise à jour de la file', {
    body: `Position: ${position} - Temps d'attente: ${waitTime} min`,
    icon: '/favicon.ico',
    tag: 'queue-update'
  });
};

/**
 * Play notification sound
 * @param {string} type - Sound type ('success', 'warning', 'info')
 */
export const playNotificationSound = (type = 'info') => {
  // Create audio context for notification sounds
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const frequencies = {
    success: [523.25, 659.25, 783.99], // C5, E5, G5
    warning: [440, 554.37], // A4, C#5
    info: [523.25, 659.25] // C5, E5
  };

  const freq = frequencies[type] || frequencies.info;
  
  freq.forEach((frequency, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }, index * 150);
  });
};
