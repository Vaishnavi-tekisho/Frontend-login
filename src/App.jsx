/**
 * Main App Component
 * Connects Views (Components) with Controllers (Business Logic)
 * Following MVC Architecture
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

// Import Views
import LoginForm from './views/LoginForm';
import LoginSuccess from './views/LoginSuccess';
import OAuthSuccess from "./views/OAuthSuccess";
import ResetPassword from "./views/ResetPassword";
import ForgotPasswordForm from './views/ForgotPasswordForm';
import OtpVerification from './views/OtpVerification';

// Import Controller
import { AuthController } from './controllers/authController';

function App() {
  const [authController] = useState(() => new AuthController());
  const [state, setState] = useState(authController.getState());

  // Subscribe to controller state changes
  useEffect(() => {
    const unsubscribe = authController.subscribe((newState) => {
      setState(newState);
    });

    // Initialize authentication check
    authController.initialize();

    return unsubscribe;
  }, [authController]);

  // Handler functions that delegate to controller
  const handlers = {
    onToggleMode: () => authController.toggleAuthMode(),
    onAccountTypeChange: (type) => authController.setAccountType(type),
    onNameChange: (value) => authController.handleNameChange(value),
    onEmailChange: (value) => authController.handleEmailChange(value),
    onPhoneNumberChange: (value) => authController.handlePhoneNumberChange(value),
    onPasswordChange: (value) => authController.handlePasswordChange(value),
    onConfirmPasswordChange: (value) => authController.handleConfirmPasswordChange(value),
    onOrgCodeChange: (value) => authController.handleOrgCodeChange(value),
    onRememberMeChange: (checked) => authController.handleRememberMeChange(checked),
    onSubmit: () => authController.handleSubmit(),
    onGoogleLogin: () => authController.handleGoogleLogin(),
    onLogout: () => authController.handleLogout(),
    // OTP handlers
    onOTPCodeChange: (value) => authController.handleOTPCodeChange(value),
    onSendOTP: () => authController.handleSendOTP(),
    onVerifyOTP: () => authController.handleVerifyOTP(),
    onResendOTP: () => authController.handleResendOTP()
  };

  return (
    <Routes>
      {/* MAIN LOGIN / SIGNUP PAGE */}
      <Route
        path="/"
        element={
          state.isLoggedIn ? (
            <LoginSuccess
              userData={state.userData}
              onLogout={handlers.onLogout}
            />
          ) : (
            <LoginForm
              isSignUp={state.isSignUp}
              accountType={state.accountType}
              name={state.name}
              email={state.email}
              phoneNumber={state.phoneNumber}
              password={state.password}
              confirmPassword={state.confirmPassword}
              organizationCode={state.organizationCode}
              rememberMe={state.rememberMe}
              errors={state.errors}
              passwordStrength={state.passwordStrength}
              loading={state.loading}
              error={state.error}
              success={state.success}
              onToggleMode={handlers.onToggleMode}
              onAccountTypeChange={handlers.onAccountTypeChange}
              onNameChange={handlers.onNameChange}
              onEmailChange={handlers.onEmailChange}
              onPhoneNumberChange={handlers.onPhoneNumberChange}
              onPasswordChange={handlers.onPasswordChange}
              onConfirmPasswordChange={handlers.onConfirmPasswordChange}
              onOrgCodeChange={handlers.onOrgCodeChange}
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
              onForgotPasswordSubmit={handlers.onSendOTP}
            />
          )
        }
      />

      {/* SUCCESS ROUTE (USED BY OAUTH) */}
      <Route
        path="/success"
        element={
          <LoginSuccess
            userData={state.userData}
            onLogout={handlers.onLogout}
          />
        }
      />

      {/* GOOGLE OAUTH CALLBACK HANDLER */}
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* FORGOT PASSWORD FLOW */}
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordForm
            email={state.email}
            onEmailChange={handlers.onEmailChange}
            onSendOTP={handlers.onSendOTP}
            loading={state.loading}
            error={state.error}
            success={state.success}
          />
        }
      />
      <Route
        path="/verify-otp"
        element={
          <OtpVerification
            otp={state.otpCode}
            onOtpChange={handlers.onOTPCodeChange}
            onVerifyOtp={handlers.onVerifyOTP}
            loading={state.otpLoading}
            error={state.otpError}
            success={state.success}
          />
        }
      />
      <Route
        path="/reset-password"
        element={
          <ResetPassword
            newPassword={state.password}
            confirmPassword={state.confirmPassword}
            onNewPasswordChange={handlers.onPasswordChange}
            onConfirmPasswordChange={handlers.onConfirmPasswordChange}
            onResetPassword={handlers.onSubmit}
            loading={state.loading}
            error={state.error}
            success={state.success}
          />
        }
      />
    </Routes>
  );
}

export default App;
