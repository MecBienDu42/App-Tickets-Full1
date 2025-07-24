// Utility to clear localStorage and fix authentication issues
export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Authentication storage cleared');
};

// Clear all localStorage
export const clearAllStorage = () => {
  localStorage.clear();
  console.log('All localStorage cleared');
};

// Check if storage has corrupted data
export const checkStorageHealth = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  console.log('Storage Health Check:');
  console.log('Token:', token ? 'Present' : 'Missing');
  console.log('User Data:', userData ? 'Present' : 'Missing');
  
  if (userData && userData !== 'undefined') {
    try {
      JSON.parse(userData);
      console.log('User data is valid JSON');
    } catch (error) {
      console.error('User data is corrupted:', error);
      return false;
    }
  }
  
  return true;
};
