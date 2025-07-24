import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

const AuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const diagnoseAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    const info = {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'null',
      hasUser: !!user,
      userValid: false
    };

    if (user) {
      try {
        const userData = JSON.parse(user);
        info.userValid = true;
        info.userRole = userData.role;
        info.userEmail = userData.email;
      } catch (error) {
        info.userError = error.message;
      }
    }

    setDebugInfo(info);
  };

  const testProfileAPI = async () => {
    try {
      const response = await apiService.getUserProfile();
      setTestResult({ success: true, data: response });
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error.response?.status || 'Unknown',
        message: error.response?.data?.message || error.message 
      });
    }
  };

  const refreshToken = async () => {
    try {
      // Simuler une reconnexion
      const credentials = {
        email: 'agent@test.com',
        password: 'password'
      };
      
      const response = await apiService.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setTestResult({ success: true, message: 'Token refreshed successfully' });
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: 'Refresh failed',
        message: error.message 
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-md">
      <h3 className="font-bold text-sm mb-2">🔧 Auth Debugger</h3>
      
      <div className="space-y-2">
        <button 
          onClick={diagnoseAuth}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Diagnose Auth
        </button>
        
        <button 
          onClick={testProfileAPI}
          className="bg-green-500 text-white px-3 py-1 rounded text-xs ml-2"
        >
          Test Profile API
        </button>
        
        <button 
          onClick={refreshToken}
          className="bg-orange-500 text-white px-3 py-1 rounded text-xs ml-2"
        >
          Refresh Token
        </button>
      </div>

      {debugInfo && (
        <div className="mt-3 text-xs">
          <h4 className="font-semibold">Debug Info:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {testResult && (
        <div className="mt-3 text-xs">
          <h4 className="font-semibold">Test Result:</h4>
          <div className={`p-2 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
