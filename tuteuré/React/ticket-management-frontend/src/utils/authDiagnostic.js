// Script de diagnostic pour l'authentification
export const diagnoseAuthIssue = () => {
  console.log('=== DIAGNOSTIC AUTHENTIFICATION ===');
  
  // Vérifier le token dans localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token présent:', !!token);
  console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('User data présent:', !!user);
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('User parsed successfully:', userData);
    } catch (error) {
      console.error('Erreur parsing user data:', error);
    }
  }
  
  // Tester une requête API simple
  return {
    hasToken: !!token,
    hasUser: !!user,
    tokenPreview: token ? token.substring(0, 20) + '...' : null
  };
};

// Fonction pour nettoyer et reconnecter
export const resetAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
