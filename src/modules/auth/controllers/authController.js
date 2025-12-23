/**
 * Authentication Controller
 * Handles authentication business logic and state management
 */
import { AuthService } from '../models/authService';
import { UserModel } from '../models/userModel';
import * as validation from '../utils/validation';

export class AuthController {
  /**
   * Forgot Password: Send OTP to email
   */
  async forgotPasswordSendOTP(email) {
    this.setState({ loading: true, error: '', success: '' });
    try {
      await AuthService.forgotPasswordSendOTP(email);
      this.setState({ loading: false });
      return true;
    } catch (err) {
      this.setState({ loading: false, error: err.message || 'Failed to send OTP' });
      throw err;
    }
  }

  /**
   * Forgot Password: Verify OTP
   */
  async forgotPasswordVerifyOTP(email, otp) {
    this.setState({ loading: true, error: '', success: '' });
    try {
      await AuthService.forgotPasswordVerifyOTP(email, otp);
      this.setState({ loading: false });
      return true;
    } catch (err) {
      this.setState({ loading: false, error: err.message || 'Invalid or expired OTP' });
      throw err;
    }
  }

  /**
   * Forgot Password: Reset password
   */
  async forgotPasswordResetPassword(email, otp, newPassword) {
    this.setState({ loading: true, error: '', success: '' });
    try {
      await AuthService.forgotPasswordResetPassword(email, otp, newPassword);
      this.setState({ loading: false });
      return true;
    } catch (err) {
      this.setState({ loading: false, error: err.message || 'Failed to reset password' });
      throw err;
    }
  }
  constructor() {
    this.state = {
      isSignUp: false,
      isForgotPassword: false,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
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
      otpError: '',
      // Forgot password flow state
      forgotPasswordStep: 1, // 1=email, 2=otp, 3=reset
      forgotPasswordOTP: '',
      forgotPasswordNewPassword: '',
      forgotPasswordConfirmPassword: '',
      // Verification state
      verificationLoading: false,
      verificationMessage: '',
      verificationError: '',
      verificationCooldown: 0,
      verificationStatus: 'verifying' // verifying, success, error
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
      errors: {},
      forgotPasswordStep: 1,
      forgotPasswordOTP: '',
      forgotPasswordNewPassword: '',
      forgotPasswordConfirmPassword: '',
      // Ensure email persists for better UX (autofill from login)
      email: this.state.email
    });
  }

  /**
   * Handle forgot password submission - Step 1: Send OTP
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
      // Call the forgot password send OTP endpoint
      await AuthService.forgotPasswordSendOTP(this.state.email);

      this.setState({
        success: 'OTP has been sent to your email.',
        loading: false,
        forgotPasswordStep: 2 // Move to OTP verification step
      });
    } catch (err) {
      this.setState({
        error: err.message || 'Failed to send OTP',
        loading: false
      });
    }
  }

  /**
   * Handle forgot password OTP verification - Step 2
   */
  async handleForgotPasswordVerifyOTP() {
    this.setState({ error: '', success: '' });

    if (!this.state.forgotPasswordOTP || this.state.forgotPasswordOTP.length !== 6) {
      this.setState({ error: 'Please enter the 6-digit OTP' });
      return;
    }

    this.setState({ loading: true });

    try {
      await AuthService.forgotPasswordVerifyOTP(this.state.email, this.state.forgotPasswordOTP);

      this.setState({
        success: 'OTP verified. Please enter your new password.',
        loading: false,
        forgotPasswordStep: 3 // Move to password reset step
      });
    } catch (err) {
      this.setState({
        error: err.message || 'Invalid or expired OTP',
        loading: false
      });
    }
  }

  /**
   * Handle password reset - Step 3
   */
  async handleForgotPasswordReset() {
    this.setState({ error: '', success: '' });

    const trimmedNew = this.state.forgotPasswordNewPassword?.trim() || "";
    const trimmedConfirm = this.state.forgotPasswordConfirmPassword?.trim() || "";

    console.log("DEBUG: New Pass (trimmed) Length:", trimmedNew.length);
    console.log("DEBUG: Confirm Pass (trimmed) Length:", trimmedConfirm.length);
    console.log("DEBUG: Match? (trimmed):", trimmedNew === trimmedConfirm);

    if (!trimmedNew || !trimmedConfirm) {
      this.setState({ error: 'Please fill in both password fields' });
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      console.log("DEBUG: Password Mismatch Detected [Controller]");
      this.setState({ error: 'Passwords do not match [Controller Check]' });
      return;
    }

    const passwordValidation = validation.validatePassword(this.state.forgotPasswordNewPassword);
    if (!passwordValidation.valid) {
      this.setState({ error: passwordValidation.error });
      return;
    }

    this.setState({ loading: true });

    try {
      const response = await AuthService.forgotPasswordResetPassword(
        this.state.email,
        this.state.forgotPasswordOTP,
        this.state.forgotPasswordNewPassword
      );

      console.log("DEBUG: Reset response received", response);

      // 1. Store token and user data for automatic login
      if (response.access_token && response.user) {
        AuthService.storeToken(response.access_token, this.state.rememberMe);
        AuthService.storeUserData(response.user);
      }

      this.setState({
        success: 'Password reset successfully! Redirecting to dashboard...',
        loading: false,
        isLoggedIn: !!response.access_token,
        userData: response.user || null,
        isForgotPassword: false
      });

      // Clear the reset-related state after a short delay if needed, 
      // but the redirection should happen immediately due to isLoggedIn: true
    } catch (err) {
      this.setState({
        error: err.message || 'Failed to reset password',
        loading: false
      });
    }
  }

  /**
   * Handle forgot password OTP change
   */
  handleForgotPasswordOTPChange(value) {
    this.setState({ forgotPasswordOTP: value.replace(/\D/g, '').slice(0, 6) });
  }

  /**
   * Handle forgot password new password change
   */
  handleForgotPasswordNewPasswordChange(value) {
    this.setState({ forgotPasswordNewPassword: value });
  }

  /**
   * Handle forgot password confirm password change
   */
  handleForgotPasswordConfirmPasswordChange(value) {
    this.setState({ forgotPasswordConfirmPassword: value });
  }

  /**
   * Toggle between signup and login
   */
  toggleAuthMode() {
    this.setState({
      isSignUp: !this.state.isSignUp,
      isForgotPassword: false,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      confirmPassword: '',
      error: '',
      success: '',
      errors: {},
      passwordStrength: ''
    });
  }

  /**
   * Handle first name change with validation
   */
  handleFirstNameChange(value) {
    this.setState({ firstName: value });
    if (value) {
      const validation_result = validation.validateName(value);
      this.setState({
        errors: { ...this.state.errors, firstName: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, firstName: '' }
      });
    }
  }

  /**
   * Handle last name change with validation
   */
  handleLastNameChange(value) {
    this.setState({ lastName: value });
    if (value) {
      const validation_result = validation.validateName(value);
      this.setState({
        errors: { ...this.state.errors, lastName: validation_result.error }
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, lastName: '' }
      });
    }
  }

  /**
   * Handle phone number change with validation
   */
  handlePhoneNumberChange(value) {
    if (value) {
      const validation_result = validation.validatePhone(value);
      this.setState({
        phoneNumber: value,
        errors: { ...this.state.errors, phoneNumber: validation_result.error }
      });
    } else {
      this.setState({
        phoneNumber: value,
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
      const firstNameValidation = validation.validateName(this.state.firstName);
      if (!firstNameValidation.valid) newErrors.firstName = firstNameValidation.error;

      const lastNameValidation = validation.validateName(this.state.lastName);
      if (!lastNameValidation.valid) newErrors.lastName = lastNameValidation.error;

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
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        password: this.state.password
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
      error: '',
      success: '',
      otpSent: false,
      otpCode: '',
      otpVerified: false,
      otpExpiry: null,
      otpError: ''
    });
    // Redirect to login page
    window.location.href = '/login';
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

  /**
   * Handle Resend Verification Email
   */
  async handleResendVerification(email) {
    if (this.state.verificationCooldown > 0) return;

    this.setState({ verificationLoading: true, verificationError: '', verificationMessage: '' });

    try {
      const res = await AuthService.requestEmailVerification(email);
      this.setState({
        verificationMessage: res.message || 'Verification email sent!',
        verificationCooldown: 120, // 2 minutes
        verificationLoading: false
      });

      // Start cooldown timer (simple setInterval for this instance)
      const timer = setInterval(() => {
        const newCooldown = this.state.verificationCooldown - 1;
        if (newCooldown <= 0) {
          clearInterval(timer);
          this.setState({ verificationCooldown: 0 });
        } else {
          this.setState({ verificationCooldown: newCooldown });
        }
      }, 1000);

    } catch (err) {
      let errorMsg = err.message || 'Failed to resend email';
      if (errorMsg.includes('wait')) {
        const seconds = parseInt(errorMsg.match(/\d+/)?.[0] || '60');
        this.setState({ verificationCooldown: seconds });
      }
      this.setState({
        verificationError: errorMsg,
        verificationLoading: false
      });
    }
  }

  /**
   * Handle Email Verification Token
   */
  async handleVerifyEmail(email, token) {
    this.setState({ verificationStatus: 'verifying', verificationError: '' });

    if (!token || !email) {
      this.setState({ verificationStatus: 'error', verificationError: 'Invalid or missing verification details.' });
      return;
    }

    try {
      await AuthService.verifyEmail(email, token);

      // Update local storage user data if it exists
      const user = AuthService.getUserData();
      if (user) {
        user.email_verified = true;
        AuthService.storeUserData(user);
        this.setState({ userData: new UserModel(user) });
      }

      this.setState({ verificationStatus: 'success' });
    } catch (err) {
      this.setState({
        verificationStatus: 'error',
        verificationError: err.message || 'Verification failed. The link may be expired or invalid.'
      });
    }
  }
}

