import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [testResult, setTestResult] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const [registerResult, setRegisterResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testPing = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing ping endpoint...');
      const response = await axios.get('/api/test/ping');
      console.log('Ping response:', response);
      setTestResult(response.data);
    } catch (err) {
      console.error('Ping test failed:', err);
      setError(err.message || 'An error occurred during the ping test');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing login endpoint...');
      const response = await axios.post('/api/auth/signin', {
        username: 'testuser',
        password: 'password123'
      }, {
        validateStatus: function (status) {
          return true; // Accept any status code
        }
      });
      console.log('Login response:', response);
      setLoginResult(response.data);
    } catch (err) {
      console.error('Login test failed:', err);
      setError(err.message || 'An error occurred during the login test');
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing register endpoint...');
      const response = await axios.post('/api/auth/signup', {
        username: 'testuser' + Math.floor(Math.random() * 10000),
        email: 'testuser' + Math.floor(Math.random() * 10000) + '@example.com',
        fullName: 'Test User',
        phoneNo: '1234567890',
        password: 'password123',
        roles: ['ROLE_USER']
      }, {
        validateStatus: function (status) {
          return true; // Accept any status code
        }
      });
      console.log('Register response:', response);
      setRegisterResult(response.data);
    } catch (err) {
      console.error('Register test failed:', err);
      setError(err.message || 'An error occurred during the register test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Ping Endpoint</h2>
        <button 
          onClick={testPing}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Testing...' : 'Test Ping'}
        </button>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-medium">Response:</h3>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Login Endpoint</h2>
        <button 
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
        
        {loginResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-medium">Response:</h3>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(loginResult, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Register Endpoint</h2>
        <button 
          onClick={testRegister}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300"
        >
          {loading ? 'Testing...' : 'Test Register'}
        </button>
        
        {registerResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-medium">Response:</h3>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(registerResult, null, 2)}</pre>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h3 className="font-medium">Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;