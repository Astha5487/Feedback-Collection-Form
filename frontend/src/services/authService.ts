import api from './api';

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNo?: string;
  roles?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// Authentication service
const authService = {
  // Login user
  login: async (loginRequest: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/signin', loginRequest);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Register user
  register: async (signupRequest: SignupRequest) => {
    return await api.post('/auth/signup', signupRequest);
  },

  // Forgot password
  forgotPassword: async (forgotPasswordRequest: ForgotPasswordRequest) => {
    return await api.post('/auth/forgot-password', forgotPasswordRequest);
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check authentication status with the server
  checkAuthStatus: async () => {
    try {
      // First check if we have a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      // Make a request to a protected endpoint to verify the token is valid
      // We'll use the /forms endpoint since it requires authentication
      await api.get('/forms');
      return true;
    } catch (error) {
      // If the request fails, the token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  }
};

export default authService;