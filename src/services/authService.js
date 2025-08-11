import api from './apiInterceptor';
import { API_ENDPOINTS, API_ERROR_MESSAGES } from '../config/apiConfig';

class AuthService {
  // Store token
  static setToken(token) {
    try {
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  // Get token
  static getToken() {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Store user data
  static setUser(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  // Get user data
  static getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    try {
      const token = this.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Clear all auth data
  static clearAuth() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('_id');
      localStorage.removeItem('profileupdate');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Initialize auth state from storage
  static initializeAuth() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      
      return {
        token,
        user,
        isAuthenticated: !!token,
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    }
  }

  // API Methods
  static async login(credentials) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async signup(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async googleSignup(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_SIGNUP, userData);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async linkedinLogin(linkedinData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LINKEDIN_LOGIN, linkedinData);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async resetPassword(resetData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async verifyCode(verificationData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_CODE, verificationData);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async updateVerificationCode(email) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.UPDATE_VERIFICATION_CODE, { email });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async getUserById(userId) {
    try {
      const response = await api.get(`${API_ENDPOINTS.AUTH.GET_USER_BY_ID}/${userId}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }

  static async getTermsAndConditions() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.GET_TERMS_AND_CONDITIONS);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || API_ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status,
      };
    }
  }
}

export default AuthService; 