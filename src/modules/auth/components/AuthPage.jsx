/**
 * Main App Component
 * Connects Views (Components) with Controllers (Business Logic)
 * Following MVC Architecture
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import '../styles/styles-auth.css'

// Import Views
import LoginForm from '../views/LoginForm';
import OAuthSuccess from "../views/OAuthSuccess";
import ForgotPasswordForm from '../views/ForgetPasswordForm';
import VerifyEmailPage from '../views/VerifyEmailPage';
import VerificationSuccessPage from '../views/VerificationSuccessPage';

// Import Controller
import { AuthController } from '../controllers/authController';

function AuthPage() {
  const [authController] = useState(() => new AuthController());
  const [state, setState] = useState(authController.getState());
  const navigate = useNavigate();

  // Subscribe to controller state changes
  useEffect(() => {
    const unsubscribe = authController.subscribe((newState) => {
      setState(newState);
    });

    // Initialize authentication check
    authController.initialize();

    return unsubscribe;
  }, [authController]);

  // Redirect to dashboard (or verify email) when user becomes logged in
  useEffect(() => {
    if (state.isLoggedIn) {
      const currentPath = window.location.pathname;
      console.log('🔄 [AuthPage Redirect Check]', {
        currentPath,
        isLoggedIn: state.isLoggedIn,
        verified: state.userData?.email_verified
      });

      if (state.userData && !state.userData.email_verified) {
        // Only redirect to verify-email if not already on verification pages
        if (!currentPath.includes('/verify-email') && !currentPath.includes('/verification-success')) {
          console.log('➡️ Redirecting to verify-email');
          navigate('/login/verify-email', { replace: true });
        }
      } else {
        // If verified, go to dashboard
        if (!currentPath.includes('/dashboard')) {
          console.log('➡️ Redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [state.isLoggedIn, state.userData, navigate]);

  // Debugging: Log current path and state
  console.log('🛡️ [AuthPage Render]', {
    path: window.location.pathname,
    isLoggedIn: state.isLoggedIn,
    verificationStatus: state.verificationStatus
  });

  // Handler functions that delegate to controller
  const handlers = {
    onToggleMode: () => authController.toggleAuthMode(),
    onFirstNameChange: (value) => authController.handleFirstNameChange(value),
    onLastNameChange: (value) => authController.handleLastNameChange(value),
    onEmailChange: (value) => authController.handleEmailChange(value),
    onPhoneNumberChange: (value) => authController.handlePhoneNumberChange(value),
    onPasswordChange: (value) => authController.handlePasswordChange(value),
    onConfirmPasswordChange: (value) => authController.handleConfirmPasswordChange(value),
    onRememberMeChange: (checked) => authController.handleRememberMeChange(checked),
    onSubmit: () => authController.handleSubmit(),
    onGoogleLogin: () => authController.handleGoogleLogin(),
    onLogout: () => authController.handleLogout(),
    // OTP handlers
    onOTPCodeChange: (value) => authController.handleOTPCodeChange(value),
    onSendOTP: () => authController.handleSendOTP(),
    onVerifyOTP: () => authController.handleVerifyOTP(),
    onResendOTP: () => authController.handleResendOTP(),
    // Forgot password handler
    onForgotPasswordSubmit: () => authController.handleForgotPassword(),
    onForgotPasswordVerifyOTP: () => authController.handleForgotPasswordVerifyOTP(),
    onForgotPasswordReset: () => authController.handleForgotPasswordReset(),
    onForgotPasswordOTPChange: (value) => authController.handleForgotPasswordOTPChange(value),
    onForgotPasswordNewPasswordChange: (value) => authController.handleForgotPasswordNewPasswordChange(value),
    onForgotPasswordConfirmPasswordChange: (value) => authController.handleForgotPasswordConfirmPasswordChange(value),
    // Email verification handlers
    onResendVerification: (email) => authController.handleResendVerification(email),
    onVerifyEmail: (email, token) => authController.handleVerifyEmail(email, token)
  };

  // If logged in and at the root of auth page, show loading while redirecting
  // Otherwise, allow nested routes (like verify-email) to render
  if (state.isLoggedIn && window.location.pathname === '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D6EFD] via-[#2B8FE6] to-[#3AA0FF]">
        <p className="text-white text-xl">Redirecting...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* MAIN LOGIN / SIGNUP PAGE */}
      <Route
        path="/"
        element={
          <LoginForm
            isSignUp={state.isSignUp}
            firstName={state.firstName}
            lastName={state.lastName}
            email={state.email}
            phoneNumber={state.phoneNumber}
            password={state.password}
            confirmPassword={state.confirmPassword}
            rememberMe={state.rememberMe}
            errors={state.errors}
            passwordStrength={state.passwordStrength}
            loading={state.loading}
            error={state.error}
            success={state.success}
            onToggleMode={handlers.onToggleMode}
            onFirstNameChange={handlers.onFirstNameChange}
            onLastNameChange={handlers.onLastNameChange}
            onEmailChange={handlers.onEmailChange}
            onPhoneNumberChange={handlers.onPhoneNumberChange}
            onPasswordChange={handlers.onPasswordChange}
            onConfirmPasswordChange={handlers.onConfirmPasswordChange}
            onRememberMeChange={handlers.onRememberMeChange}
            onSubmit={handlers.onSubmit}
            onGoogleLogin={handlers.onGoogleLogin}
            otpSent={state.otpSent}
            otpCode={state.otpCode}
            otpVerified={state.otpVerified}
            otpLoading={state.otpLoading}
            otpError={state.otpError}
            onOTPCodeChange={handlers.onOTPCodeChange}
            onSendOTP={handlers.onSendOTP}
            onVerifyOTP={handlers.onVerifyOTP}
            onResendOTP={handlers.onResendOTP}
            isForgotPassword={state.isForgotPassword}
            onToggleForgotPassword={() => authController.toggleForgotPassword()}
            onForgotPasswordSubmit={handlers.onForgotPasswordSubmit}
            forgotPasswordStep={state.forgotPasswordStep}
            forgotPasswordOTP={state.forgotPasswordOTP}
            forgotPasswordNewPassword={state.forgotPasswordNewPassword}
            forgotPasswordConfirmPassword={state.forgotPasswordConfirmPassword}
            onForgotPasswordOTPChange={handlers.onForgotPasswordOTPChange}
            onForgotPasswordVerifyOTP={handlers.onForgotPasswordVerifyOTP}
            onForgotPasswordNewPasswordChange={handlers.onForgotPasswordNewPasswordChange}
            onForgotPasswordConfirmPasswordChange={handlers.onForgotPasswordConfirmPasswordChange}
            onForgotPasswordReset={handlers.onForgotPasswordReset}
          />
        }
      />

      {/* SUCCESS ROUTE - Redirect to dashboard */}
      <Route
        path="success"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* GOOGLE OAUTH CALLBACK HANDLER */}
      <Route path="oauth-success" element={<OAuthSuccess />} />

      {/* FORGOT PASSWORD FLOW */}
      <Route
        path="forgot-password"
        element={<ForgotPasswordForm />}
      />

      {/* EMAIL VERIFICATION */}
      <Route
        path="verify-email"
        element={
          <VerifyEmailPage
            userData={state.userData}
            loading={state.verificationLoading}
            message={state.verificationMessage}
            error={state.verificationError}
            cooldown={state.verificationCooldown}
            onResend={handlers.onResendVerification}
            onBackToLogin={handlers.onLogout}
          />
        }
      />
      <Route
        path="verification-success"
        element={
          <VerificationSuccessPage
            status={state.verificationStatus}
            error={state.verificationError}
            onVerify={handlers.onVerifyEmail}
          />
        }
      />

      {/* Fallback for unmatched routes inside AuthPage */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">404 - Route Not Found</h2>
              <p className="text-gray-600">The requested path inside AuthPage was not found.</p>
              <p className="text-xs text-gray-400 mt-2">Path: {window.location.pathname}</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AuthPage;
