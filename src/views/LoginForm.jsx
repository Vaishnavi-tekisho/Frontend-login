/**
 * Login Form View Component
 * Pure presentation component - receives props and renders UI
 */
import React, { useState } from 'react';

export function ForgotPasswordForm({
  email,
  onEmailChange,
  onSendOTP,
  loading,
  error,
  success
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl w-full max-w-md p-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <form onSubmit={onSendOTP}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onEmailChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginForm({
  isSignUp,
  accountType,
  name,
  email,
  phoneNumber,
  password,
  confirmPassword,
  organizationCode,
  rememberMe,
  errors,
  passwordStrength,
  loading,
  error,
  success,
  onToggleMode,
  onAccountTypeChange,
  onNameChange,
  onEmailChange,
  onPhoneNumberChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onOrgCodeChange,
  onRememberMeChange,
  onSubmit,
  onGoogleLogin,
  otpSent,
  otpCode,
  otpVerified,
  otpLoading,
  otpError,
  onOTPCodeChange,
  onSendOTP,
  onVerifyOTP,
  onResendOTP,
  isForgotPassword,
  onToggleForgotPassword,
  onForgotPasswordSubmit
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'good': return 'bg-blue-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-0 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600 font-sans">
      {/* Background Decor (Bubbles/Waves effect) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className="bg-white/95 backdrop-blur-lg rounded-3xl w-full max-w-md p-10 shadow-2xl relative z-10 border border-white/20"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {isForgotPassword ? (
          /* FORGOT PASSWORD VIEW */
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-blue-900 mb-2 tracking-tight">
                Reset your password
              </h1>
              <p className="text-slate-500">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-600 text-sm font-bold mb-2 pl-1">
                  Email Address
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={`w-full px-5 py-4 border rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.email ? 'border-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>
                )}
              </div>

              <button
                onClick={onForgotPasswordSubmit}
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>

              <button
                onClick={onToggleForgotPassword}
                className="w-full text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          </>
        ) : (
          /* LOGIN / SIGNUP VIEW */
          <>
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-blue-900 mb-2 tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome'}
              </h1>
              <p className="text-slate-500">
                {isSignUp ? 'Get started with LeadQ today' : 'Enter your details to access your account'}
              </p>
            </div>

            {/* Account Type Selector */}
            <div className="mb-6 relative">
              <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                Account Type
              </label>
              <div className="relative">
                <select
                  value={accountType}
                  onChange={(e) => onAccountTypeChange(e.target.value)}
                  className="w-full appearance-none px-5 py-4 border border-slate-300 rounded-2xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all cursor-pointer hover:border-blue-400"
                >
                  <option value="USER">User Account</option>
                  <option value="BUSINESS">Business Account</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Name Field */}
              {isSignUp && (
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                    Full Name

                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className={`w-full px-5 py-4 border rounded-2xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.name ? 'border-red-300' : 'border-slate-300'
                      }`}

                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                  {accountType === 'BUSINESS' ? 'Work Email' : 'Email Address'}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={`w-full px-5 py-4 border rounded-2xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.email ? 'border-red-300' : 'border-slate-300'
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number Field */}
              {isSignUp && (
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => onPhoneNumberChange(e.target.value)}
                    className={`w-full px-5 py-4 border rounded-2xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.phoneNumber ? 'border-red-300' : 'border-slate-300'
                      }`}

                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{errors.phoneNumber}</p>
                  )}

                  {/* OTP Verification Section */}
                  {!otpVerified && phoneNumber && !errors.phoneNumber && (
                    <div className="mt-4 p-4 bg-slate-100 rounded-2xl border border-slate-300">
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={onSendOTP}
                          disabled={otpLoading}
                          className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                          {otpLoading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otpCode}
                              onChange={(e) => onOTPCodeChange(e.target.value)}
                              maxLength={6}
                              className="flex-1 px-5 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-center tracking-widest text-lg"
                              placeholder="000000"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={onVerifyOTP}
                              disabled={otpLoading || otpCode.length !== 6}
                              className="flex-1 py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                            >
                              {otpLoading ? 'Verifying...' : 'Verify'}
                            </button>
                            <button
                              type="button"
                              onClick={onResendOTP}
                              disabled={otpLoading}
                              className="px-4 py-3 bg-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-300 transition-colors disabled:opacity-50"
                            >
                              Resend
                            </button>
                          </div>
                          {otpError && (
                            <p className="text-red-500 text-xs text-center">{otpError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* OTP Verified Indicator */}
                  {otpVerified && (
                    <div className="mt-3 flex items-center gap-2 text-green-600 text-sm pl-1">
                      <div className="p-1 bg-green-100 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Verified
                    </div>
                  )}
                </div>
              )}

              {/* Organization Code */}
              {accountType === 'BUSINESS' && (
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                    Organization Code
                  </label>
                  <input
                    type="text"
                    value={organizationCode}
                    onChange={(e) => onOrgCodeChange(e.target.value)}
                    className={`w-full px-5 py-4 border rounded-2xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.organizationCode ? 'border-red-300' : 'border-slate-300'
                      }`}

                  />
                  {errors.organizationCode && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{errors.organizationCode}</p>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    className={`w-full px-5 py-4 border rounded-2xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.password ? 'border-red-300' : 'border-slate-300'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>
                )}

                {/* Password Strength Indicator */}
                {isSignUp && password && !errors.password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${getStrengthColor(passwordStrength)}`}
                          style={{
                            width: passwordStrength === 'weak' ? '25%' :
                              passwordStrength === 'medium' ? '50%' :
                                passwordStrength === 'good' ? '75%' : '100%'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 capitalize">{passwordStrength}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              {isSignUp && (
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-bold mb-2 pl-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => onConfirmPasswordChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl bg-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                        }`}

                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Remember Me */}
              {!isSignUp && (
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => onRememberMeChange(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-slate-600">Remember me</span>
                  </label>
                  <button
                    onClick={onToggleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={onSubmit}
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition duration-200 mb-4 animate-gradient-button ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient-flow 3s ease infinite'
                }}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Log In'}
              </button>

              {/* GOOGLE OAUTH BUTTON */}
              <button
                type="button"
                onClick={onGoogleLogin}
                className="w-full border border-slate-200 bg-white text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition duration-200 mb-4 flex items-center justify-center gap-2 shadow-sm"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            </div>

            <p className="text-center text-slate-500 text-sm mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
