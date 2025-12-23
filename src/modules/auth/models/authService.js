/**
 * Authentication Service (Model Layer)
 * Handles all API calls related to authentication
 */

const API_URL = 'http://localhost:8000';

export class AuthService {
  /**
   * Forgot Password: Send OTP to email
   * @param {string} email
   */
  static async forgotPasswordSendOTP(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to send OTP');
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Forgot Password: Verify OTP
   * @param {string} email
   * @param {string} otp
   */
  static async forgotPasswordVerifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Invalid or expired OTP');
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Forgot Password: Reset password
   * @param {string} email
   * @param {string} otp
   * @param {string} newPassword
   */
  static async forgotPasswordResetPassword(email, otp, newPassword) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to reset password');
      }
      return data;
    } catch (err) {
      throw err;
    }
  }
  /**
   * Sign up a new user
   * @param {Object} userData - User signup data
   * @returns {Promise<Object>} Response with token and user data
   */
  static async signup(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone_number: userData.phoneNumber,
          password: userData.password
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        let errorMessage = data.detail || data.message || `Sign up failed (${response.status})`;
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.map(err => err.msg || JSON.stringify(err)).join(', ');
        } else if (typeof errorMessage === 'object') {
          errorMessage = JSON.stringify(errorMessage);
        }
        throw new Error(errorMessage);
      }

      if (!data.access_token || !data.user) {
        throw new Error('Invalid response from server: missing token or user data');
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw err;
    }
  }

  /**
   * Log in a user
   * @param {Object} userData - User login data
   * @returns {Promise<Object>} Response with token and user data
   */
  static async login(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          remember_me: userData.rememberMe
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMessage = data.detail || data.message || `Login failed (${response.status})`;
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.map(err => err.msg || JSON.stringify(err)).join(', ');
        } else if (typeof errorMessage === 'object') {
          errorMessage = JSON.stringify(errorMessage);
        }
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
      }
      throw err;
    }
  }

  /**
   * Initiate Google OAuth login
   */
  static initiateGoogleLogin() {
    window.location.href = `${API_URL}/auth/google`;
  }

  /**
   * Send OTP to phone number
   * @param {string} phoneNumber - Phone number to send OTP to
   * @returns {Promise<Object>} Response with success status
   */
  static async sendOTP(phoneNumber) {
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to send OTP');
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server');
      }
      throw err;
    }
  }

  /**
   * Verify OTP code
   * @param {string} phoneNumber - Phone number
   * @param {string} otpCode - 6-digit OTP code
   * @returns {Promise<Object>} Response with success status
   */
  static async verifyOTP(phoneNumber, otpCode) {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to verify OTP');
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server');
      }
      throw err;
    }
  }

  /**
   * Request email verification (Resend)
   * @param {string} email - User email
   */
  static async requestEmailVerification(email) {
    try {
      const response = await fetch(`${API_URL}/auth/request-verification?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to request verification email');
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Verify email with token
   * @param {string} email - User email
   * @param {string} token - Verification token
   */
  static async verifyEmail(email, token) {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Verification failed');
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Resend OTP (same as sendOTP)
   * @param {string} phoneNumber - Phone number
   * @returns {Promise<Object>} Response with success status
   */
  static async resendOTP(phoneNumber) {
    return this.sendOTP(phoneNumber);
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Response message
   */
  static async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to request password reset');
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server');
      }
      throw err;
    }
  }

  /**
   * Confirm password reset
   * @param {string} newPassword - New password
   * @param {string} token - Supabase access token from URL
   * @returns {Promise<Object>} Response
   */
  static async confirmPasswordReset(newPassword, token) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_password: newPassword,
          supabase_access_token: token
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to reset password');
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server');
      }
      throw err;
    }
  }

  /**
   * Store authentication token
   * @param {string} token - Access token
   * @param {boolean} rememberMe - Whether to store in localStorage or sessionStorage
   */
  static storeToken(token, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('access_token', token);
    } else {
      sessionStorage.setItem('access_token', token);
    }
  }

  /**
   * Get stored authentication token
   * @returns {string|null} Access token or null
   */
  static getToken() {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  /**
   * Clear authentication token
   */
  static clearToken() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
  }

  /**
   * Store user data
   * @param {Object} userData - User data object
   */
  static storeUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  static getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clear user data
   */
  static clearUserData() {
    localStorage.removeItem('user_data');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  static isAuthenticated() {
    return !!this.getToken();
  }
}



