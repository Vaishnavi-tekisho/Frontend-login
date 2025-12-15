/**
 * Authentication Controller
 * Handles authentication business logic and state management
 */
import { AuthService } from '../models/authService';
import { UserModel } from '../models/userModel';
import * as validation from '../utils/validation';

export class AuthController {
  constructor() {
    this.state = {
      isSignUp: false,
      isForgotPassword: false,
      accountType: 'PERSONAL',
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      organizationCode: '',
      rememberMe: false,
      errors: {
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        organizationCode: '',
        otp: ''
      },
      passwordStrength: '',
      loading: false,
      error: '',
      success: '',
      isLoggedIn: false,
      userData: null,
      // OTP state
      otpSent: false,
      otpCode: '',
      otpVerified: false,
      otpExpiry: null,
      otpLoading: false,
      otpError: ''
    };

    this.listeners = [];
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify listeners of state changes
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Update state and notify listeners
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Initialize - check for existing authentication
   */
  initialize() {
    const token = AuthService.getToken();
    const storedUserData = AuthService.getUserData();

    if (token) {
      if (storedUserData) {
        try {
          this.setState({
            userData: new UserModel(storedUserData),
            isLoggedIn: true
          });
          console.log('✅ Auto-login from stored token and user data');
        } catch (e) {
          console.warn('⚠️ Could not parse stored user data:', e);
        }
      } else {
        this.setState({ isLoggedIn: true });
        console.log('✅ Auto-login from stored token (no user data)');
      }
    }
  }

  /**
   * Toggle between signup and login
   */

  /**
   * Toggle forgot password mode
   */
  toggleForgotPassword() {
    this.setState({
      isForgotPassword: !this.state.isForgotPassword,
      error: '',
      success: '',
      errors: {}
    });
  }

  /**
   * Handle forgot password submission
   */
  async handleForgotPassword() {
    this.setState({ error: '', success: '' });

    const emailValidation = validation.validateEmail(this.state.email);
    if (!emailValidation.valid) {
      this.setState({
        errors: { ...this.state.errors, email: emailValidation.error }
      });
      return;
    }

    this.setState({ loading: true });

    try {
      // Call the actual API endpoint
      const response = await AuthService.requestPasswordReset(this.state.email);

      this.setState({
        success: response.message || 'If the email exists, a reset link has been sent.',
        loading: false,
        email: '' // Clear email after success
      });
    } catch (err) {
      this.setState({
        error: err.message || 'Failed to send reset link',
        loading: false
      });
    }
  }

  /**
   * Toggle between signup and login
   */
  toggleAuthMode() {
    this.setState({
      isSignUp: !this.state.isSignUp,
      isForgotPassword: false,
      name: '',
      phoneNumber: '',
      confirmPassword: '',
      error: '',
      success: '',
      errors: {},
      passwordStrength: ''
    });
  }

  /**
   * Handle account type change
   */
  setAccountType(accountType) {
    this.setState({ accountType });
  }

  /**
   * Handle name change with validation
   */
  handleNameChange(value) {
    this.setState({ name: value });
    if (value) {
      const validation_result = validation.validateName(value);
      this.setState({
        errors: { ...this.state.errors, name: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, name: '' }
      });
    }
  }

  /**
   * Handle phone number change with validation
   */
  handlePhoneNumberChange(value) {
    this.setState({ phoneNumber: value });
    if (value) {
      const validation_result = validation.validatePhone(value);
      this.setState({
        errors: { ...this.state.errors, phoneNumber: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, phoneNumber: '' }
      });
    }
  }

  /**
   * Handle email change with validation
   */
  handleEmailChange(value) {
    this.setState({ email: value });
    if (value) {
      const validation_result = validation.validateEmail(value);
      this.setState({
        errors: { ...this.state.errors, email: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, email: '' }
      });
    }
  }

  /**
   * Handle password change with validation
   */
  handlePasswordChange(value) {
    this.setState({ password: value });
    if (value) {
      const validation_result = validation.validatePassword(value);
      this.setState({
        errors: { ...this.state.errors, password: validation_result.error },
        passwordStrength: validation_result.strength || ''
      });

      if (this.state.confirmPassword) {
        const matchValidation = validation.validatePasswordMatch(value, this.state.confirmPassword);
        this.setState({
          errors: { ...this.state.errors, confirmPassword: matchValidation.error }
        });
      }
    } else {
      this.setState({
        errors: { ...this.state.errors, password: '' },
        passwordStrength: ''
      });
    }
  }

  /**
   * Handle confirm password change with validation
   */
  handleConfirmPasswordChange(value) {
    this.setState({ confirmPassword: value });
    if (value) {
      const validation_result = validation.validatePasswordMatch(this.state.password, value);
      this.setState({
        errors: { ...this.state.errors, confirmPassword: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, confirmPassword: '' }
      });
    }
  }

  /**
   * Handle organization code change with validation
   */
  handleOrgCodeChange(value) {
    const upperValue = value.toUpperCase();
    this.setState({ organizationCode: upperValue });
    if (upperValue) {
      const validation_result = validation.validateOrgCode(upperValue);
      this.setState({
        errors: { ...this.state.errors, organizationCode: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, organizationCode: '' }
      });
    }
  }

  /**
   * Handle remember me change
   */
  handleRememberMeChange(checked) {
    this.setState({ rememberMe: checked });
  }

  /**
   * Validate the entire form
   */
  validateForm() {
    const newErrors = {};

    if (this.state.isSignUp) {
      const nameValidation = validation.validateName(this.state.name);
      if (!nameValidation.valid) newErrors.name = nameValidation.error;

      if (this.state.phoneNumber) {
        const phoneValidation = validation.validatePhone(this.state.phoneNumber);
        if (!phoneValidation.valid) newErrors.phoneNumber = phoneValidation.error;
      }
    }

    const emailValidation = validation.validateEmail(this.state.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.error;

    const passwordValidation = validation.validatePassword(this.state.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error;

    if (this.state.isSignUp) {
      const matchValidation = validation.validatePasswordMatch(
        this.state.password,
        this.state.confirmPassword
      );
      if (!matchValidation.valid) newErrors.confirmPassword = matchValidation.error;
    }

    if (this.state.accountType === 'CORPORATE' && this.state.organizationCode) {
      const orgValidation = validation.validateOrgCode(this.state.organizationCode);
      if (!orgValidation.valid) newErrors.organizationCode = orgValidation.error;
    }

    this.setState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handle signup
   */
  async handleSignUp() {
    this.setState({ error: '', success: '' });

    if (!this.validateForm()) {
      this.setState({ error: 'Please fix all validation errors before submitting' });
      return;
    }

    // Check if phone number is verified
    if (this.state.phoneNumber && !this.state.otpVerified) {
      this.setState({ error: 'Please verify your phone number with OTP before signing up' });
      return;
    }

    this.setState({ loading: true });

    try {
      const data = await AuthService.signup({
        name: this.state.name,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        password: this.state.password,
        accountType: this.state.accountType,
        organizationCode: this.state.organizationCode
      });

      console.log('✅ Signup successful!', data);

      AuthService.storeToken(data.access_token, false);
      const userModel = new UserModel(data.user);

      this.setState({
        userData: userModel,
        isLoggedIn: true,
        loading: false
      });
    } catch (err) {
      console.error('Signup error:', err);
      this.setState({
        error: err.message || 'Failed to create account. Please try again.',
        loading: false
      });
    }
  }

  /**
   * Handle login
   */
  async handleLogin() {
    this.setState({ error: '', success: '' });

    if (!this.validateForm()) {
      this.setState({ error: 'Please fix all validation errors before submitting' });
      return;
    }

    this.setState({ loading: true });

    try {
      const data = await AuthService.login({
        email: this.state.email,
        password: this.state.password,
        accountType: this.state.accountType,
        organizationCode: this.state.organizationCode,
        rememberMe: this.state.rememberMe
      });

      AuthService.storeToken(data.access_token, this.state.rememberMe);
      AuthService.storeUserData(data.user);

      const userModel = new UserModel(data.user);

      this.setState({
        userData: userModel,
        isLoggedIn: true,
        loading: false
      });
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false
      });
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    if (this.state.isSignUp) {
      await this.handleSignUp();
    } else {
      await this.handleLogin();
    }
  }

  /**
   * Handle Google OAuth login
   */
  handleGoogleLogin() {
    AuthService.initiateGoogleLogin();
  }

  /**
   * Handle logout
   */
  handleLogout() {
    AuthService.clearToken();
    AuthService.clearUserData();
    this.setState({
      isLoggedIn: false,
      userData: null,
      email: '',
      phoneNumber: '',
      password: '',
      name: '',
      confirmPassword: '',
      organizationCode: '',
      error: '',
      success: '',
      otpSent: false,
      otpCode: '',
      otpVerified: false,
      otpExpiry: null,
      otpError: ''
    });
    window.location.reload();
  }

  /**
   * Handle OTP code change
   */
  handleOTPCodeChange(value) {
    this.setState({ otpCode: value, otpError: '' });
  }

  /**
   * Handle send OTP
   */
  async handleSendOTP() {
    if (!this.state.phoneNumber) {
      this.setState({ otpError: 'Please enter a phone number first' });
      return;
    }

    const phoneValidation = validation.validatePhone(this.state.phoneNumber);
    if (!phoneValidation.valid) {
      this.setState({ otpError: phoneValidation.error });
      return;
    }

    this.setState({ otpLoading: true, otpError: '' });

    try {
      const result = await AuthService.sendOTP(this.state.phoneNumber);
      this.setState({
        otpSent: true,
        otpExpiry: result.expires_at,
        otpLoading: false,
        success: 'OTP sent to your phone number'
      });
    } catch (err) {
      this.setState({
        otpError: err.message || 'Failed to send OTP',
        otpLoading: false
      });
    }
  }

  /**
   * Handle verify OTP
   */
  async handleVerifyOTP() {
    if (!this.state.otpCode) {
      this.setState({ otpError: 'Please enter the OTP code' });
      return;
    }

    if (this.state.otpCode.length !== 6) {
      this.setState({ otpError: 'OTP must be 6 digits' });
      return;
    }

    this.setState({ otpLoading: true, otpError: '' });

    try {
      const result = await AuthService.verifyOTP(this.state.phoneNumber, this.state.otpCode);
      this.setState({
        otpVerified: true,
        otpLoading: false,
        success: 'Phone number verified successfully!',
        errors: { ...this.state.errors, phoneNumber: '' }
      });
    } catch (err) {
      this.setState({
        otpError: err.message || 'Invalid OTP code',
        otpLoading: false
      });
    }
  }

  /**
   * Handle resend OTP
   */
  async handleResendOTP() {
    this.setState({ otpCode: '', otpError: '' });
    await this.handleSendOTP();
  }
}

