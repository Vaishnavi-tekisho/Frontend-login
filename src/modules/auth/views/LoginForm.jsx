/**
 * Login Form View Component
 * Pure presentation component - receives props and renders UI
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { User, Phone, Mail, Lock, Eye, EyeOff, Shield, Check, X, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';

export function ForgotPasswordForm({
  email,
  onEmailChange,
  onSendOTP,
  loading,
  error,
  success,
  onToggleForgotPassword
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1E90FF] via-[#3BB9FF] to-[#0057FF] relative overflow-hidden">
      {/* Background patterns for consistency */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80%" cy="20%" r="30%" fill="white" fillOpacity="0.1" />
          <circle cx="10%" cy="80%" r="20%" fill="white" fillOpacity="0.1" />
        </svg>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl w-full max-w-md p-10 shadow-2xl border border-white/20 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-4 border border-white/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
          <p className="text-blue-100 opacity-80">Enter your email for the reset code</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <X size={18} className="text-red-400" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <Check size={18} className="text-green-400" />
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={onSendOTP} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0057FF] transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onEmailChange}
              placeholder=" "
              className="peer w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px]"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
            >
              Email Address
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0057FF] hover:bg-gradient-to-r hover:from-[#0057FF] hover:to-[#3BB9FF] text-white py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            disabled={loading}
          >
            {loading ? "Sending..." : (
              <>
                Send OTP Code
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleForgotPassword}
            className="w-full text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Wait, I remembered! Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginForm({
  isSignUp,
  accountType,
  firstName,
  lastName,
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
  onFirstNameChange,
  onLastNameChange,
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
  onForgotPasswordSubmit,
  forgotPasswordStep,
  forgotPasswordOTP,
  forgotPasswordNewPassword,
  forgotPasswordConfirmPassword,
  onForgotPasswordOTPChange,
  onForgotPasswordVerifyOTP,
  onForgotPasswordNewPasswordChange,
  onForgotPasswordConfirmPasswordChange,
  onForgotPasswordReset
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

  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate('/dashboard')
  }
  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-700 ${isSignUp ? 'bg-gradient-to-br from-[#1E90FF] via-[#3BB9FF] to-[#0057FF]' : 'bg-gradient-to-br from-[#1a7bb9] via-[#2b8fcc] to-[#4da8db]'}`}>
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0">
        {/* Large geometric shapes */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          {/* Large decorative circles/blobs for a modern feel */}
          <circle cx="10%" cy="10%" r="25%" fill="url(#grad1)" className="animate-pulse" style={{ animationDuration: '8s' }} />
          <circle cx="90%" cy="90%" r="30%" fill="url(#grad2)" className="animate-pulse" style={{ animationDuration: '12s' }} />
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
        </svg>

        {/* Wave pattern at bottom - matching modern illustrative style */}
        <div className="absolute bottom-0 left-0 w-full h-64 opacity-20 transform translate-y-20">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,138.7C960,117,1056,107,1152,117.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Main container */}
      <div className={`w-full ${isSignUp ? 'max-w-xl' : 'max-w-6xl'} mx-auto px-6 flex items-center justify-center gap-12 relative z-10 transition-all duration-500`}>
        {/* Left side - Logo section (Login only) */}
        {!isSignUp && !isForgotPassword && (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center">
              <img
                src="/logo.png"
                alt="LeadQ Logo"
                className="w-64 h-auto drop-shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }} className="text-white text-4xl font-bold drop-shadow-lg">
                LeadQ
              </div>
            </div>
          </div>
        )}

        {/* Vertical separator */}
        {!isSignUp && !isForgotPassword && (
          <div className="hidden lg:block w-px h-96 bg-white/30"></div>
        )}
        {/* Right side - Login form */}
        <div className={`${!isSignUp && !isForgotPassword ? 'lg:flex-1' : 'w-full'} max-w-md`}>
          <div className="bg-gradient-to-br from-white/15 to-blue-200/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
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
                  <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-4 border border-white/20">
                    <ShieldCheck size={32} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-blue-100 opacity-80">
                    {forgotPasswordStep === 1 && "Enter your email address and we'll send you an OTP to reset your password."}
                    {forgotPasswordStep === 2 && "Enter the 6-digit OTP sent to your email."}
                    {forgotPasswordStep === 3 && "Enter your new password."}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* STEP 1: EMAIL INPUT */}
                  {forgotPasswordStep === 1 && (
                    <>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                          <Mail size={20} />
                        </div>
                        <input
                          type="text"
                          id="resetEmail"
                          value={email}
                          onChange={(e) => onEmailChange(e.target.value)}
                          placeholder=" "
                          className={`peer w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.email ? 'border-red-400/50 focus:border-red-400' : ''}`}
                        />
                        <label
                          htmlFor="resetEmail"
                          className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                        >
                          Email Address
                        </label>
                        {errors.email && (
                          <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                            <X size={12} /> {errors.email}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={onForgotPasswordSubmit}
                        disabled={loading}
                        className={`w-full bg-[#0057FF] hover:bg-gradient-to-r hover:from-[#0057FF] hover:to-[#3BB9FF] text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Sending OTP...' : (
                          <>
                            Send OTP Code
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {/* STEP 2: OTP INPUT */}
                  {forgotPasswordStep === 2 && (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={forgotPasswordOTP}
                          onChange={(e) => onForgotPasswordOTPChange(e.target.value)}
                          maxLength={6}
                          className="w-full px-5 py-5 border-2 border-white/20 rounded-2xl bg-white/10 text-white placeholder-white/20 focus:border-[#0057FF] outline-none transition-all text-center tracking-[0.5em] text-3xl font-bold"
                          placeholder="000000"
                        />
                      </div>

                      <button
                        onClick={onForgotPasswordVerifyOTP}
                        disabled={loading || forgotPasswordOTP.length !== 6}
                        className={`w-full bg-[#0057FF] hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${loading || forgotPasswordOTP.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </>
                  )}

                  {/* STEP 3: NEW PASSWORD INPUT */}
                  {forgotPasswordStep === 3 && (
                    <div className="space-y-6">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                          <Lock size={20} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          value={forgotPasswordNewPassword}
                          onChange={(e) => onForgotPasswordNewPasswordChange(e.target.value)}
                          placeholder=" "
                          className="peer w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px]"
                        />
                        <label
                          htmlFor="newPassword"
                          className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                        >
                          New Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                          <ShieldCheck size={20} />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="newConfirmPassword"
                          value={forgotPasswordConfirmPassword}
                          onChange={(e) => onForgotPasswordConfirmPasswordChange(e.target.value)}
                          placeholder=" "
                          className="peer w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px]"
                        />
                        <label
                          htmlFor="newConfirmPassword"
                          className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                        >
                          Confirm New Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      <button
                        onClick={onForgotPasswordReset}
                        disabled={loading || !forgotPasswordNewPassword || forgotPasswordNewPassword !== forgotPasswordConfirmPassword}
                        className={`w-full bg-[#0057FF] hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${loading || !forgotPasswordNewPassword || forgotPasswordNewPassword !== forgotPasswordConfirmPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Reseting...' : 'Reset Password'}
                      </button>
                    </div>
                  )}

                  <div className="pt-4 text-center">
                    <button
                      onClick={onToggleForgotPassword}
                      className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* LOGIN / SIGNUP VIEW */
              <>
                {/* Header Section */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-sm">
                    {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-blue-100 text-lg opacity-90">
                    {isSignUp ? 'Join us and get started in seconds' : 'Enter your details to access your account'}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  {isSignUp && (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => onFirstNameChange(e.target.value)}
                          placeholder=" "
                          className={`peer w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.firstName ? 'border-red-400/50 focus:border-red-400' : ''}`}
                        />
                        <label
                          htmlFor="firstName"
                          className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                        >
                          First Name
                        </label>
                        {errors.firstName && (
                          <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                            <X size={12} /> {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => onLastNameChange(e.target.value)}
                          placeholder=" "
                          className={`peer w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.lastName ? 'border-red-400/50 focus:border-red-400' : ''}`}
                        />
                        <label
                          htmlFor="lastName"
                          className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                        >
                          Last Name
                        </label>
                        {errors.lastName && (
                          <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                            <X size={12} /> {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email Field - with icon and floating label */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      placeholder=" "
                      className={`peer w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.email ? 'border-red-400/50 focus:border-red-400' : ''}`}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                    >
                      {accountType === 'BUSINESS' ? 'Work Email Address' : 'Email Address'}
                    </label>
                    {errors.email && (
                      <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                        <X size={12} /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  {isSignUp && (
                    <div className="space-y-2">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-[#0057FF] transition-colors">
                          <Phone size={20} />
                        </div>
                        <PhoneInput
                          country={'in'}
                          value={phoneNumber}
                          onChange={(phone) => onPhoneNumberChange('+' + phone)}
                          enableSearch={true}
                          disableSearchIcon={true}
                          containerStyle={{ width: '100%' }}
                          inputStyle={{
                            width: '100%',
                            height: '64px',
                            fontSize: '16px',
                            paddingLeft: '54px',
                            borderRadius: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: errors.phoneNumber ? '2px solid rgba(248, 113, 113, 0.5)' : '2px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            outline: 'none',
                          }}
                          buttonStyle={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '1rem 0 0 1rem',
                            paddingLeft: '12px'
                          }}
                          dropdownStyle={{
                            borderRadius: '1rem',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
                            border: 'none',
                            backgroundColor: '#1E293B',
                            color: 'white'
                          }}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-red-200 text-xs mt-1 ml-1 flex items-center gap-1">
                          <X size={12} /> {errors.phoneNumber}
                        </p>
                      )}

                      {/* OTP Verification Section */}
                      {!otpVerified && phoneNumber && !errors.phoneNumber && (
                        <div className="mt-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
                          {!otpSent ? (
                            <button
                              type="button"
                              onClick={onSendOTP}
                              disabled={otpLoading}
                              className="w-full bg-[#0057FF] text-white py-3 rounded-xl font-bold hover:bg-[#0047CC] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                              {otpLoading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={otpCode}
                                  onChange={(e) => onOTPCodeChange(e.target.value)}
                                  maxLength={6}
                                  className="w-full px-5 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:border-[#0057FF] outline-none text-center tracking-[0.5em] text-2xl font-bold transition-all"
                                  placeholder="000000"
                                />
                              </div>
                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={onVerifyOTP}
                                  disabled={otpLoading || otpCode.length !== 6}
                                  className="flex-[2] py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                  {otpLoading ? 'Verifying...' : 'Verify'}
                                </button>
                                <button
                                  type="button"
                                  onClick={onResendOTP}
                                  disabled={otpLoading}
                                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all text-sm"
                                >
                                  Resend
                                </button>
                              </div>
                              {otpError && (
                                <p className="text-red-200 text-xs text-center flex items-center justify-center gap-1"><X size={12} /> {otpError}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* OTP Verified Indicator */}
                      {otpVerified && (
                        <div className="mt-2 flex items-center gap-2 text-green-400 text-sm font-bold pl-1 animate-in zoom-in duration-300">
                          <div className="p-1 bg-green-400/20 rounded-full">
                            <Check size={14} />
                          </div>
                          Identity Verified
                        </div>
                      )}
                    </div>
                  )}

                  {/* Organization Code */}
                  {accountType === 'BUSINESS' && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                        <Shield size={20} />
                      </div>
                      <input
                        type="text"
                        id="orgCode"
                        value={organizationCode}
                        onChange={(e) => onOrgCodeChange(e.target.value)}
                        placeholder=" "
                        className={`peer w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.organizationCode ? 'border-red-400/50 focus:border-red-400' : ''}`}
                      />
                      <label
                        htmlFor="orgCode"
                        className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                      >
                        Organization Code
                      </label>
                      {errors.organizationCode && (
                        <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X size={12} /> {errors.organizationCode}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password Field - with floating label, icon, and strength */}
                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder=" "
                        className={`peer w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.password ? 'border-red-400/50 focus:border-red-400' : ''}`}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength and Validation (Sign Up Only) */}
                    {isSignUp && password && (
                      <div className="px-1 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 flex gap-1.5">
                            {[1, 2, 3, 4].map((step) => {
                              const strengthLevel = passwordStrength === 'weak' ? 1 : passwordStrength === 'medium' ? 2 : passwordStrength === 'good' ? 3 : 4;
                              return (
                                <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step <= strengthLevel ? getStrengthColor(passwordStrength) : 'bg-white/10'}`}></div>
                              );
                            })}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                            {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : passwordStrength === 'good' ? 'Strong' : 'Very Strong'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                          <div className={`flex items-center gap-1.5 text-[11px] ${password.length >= 8 ? 'text-green-400' : 'text-white/40'}`}>
                            {password.length >= 8 ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-white/20"></div>}
                            Min. 8 characters
                          </div>
                          <div className={`flex items-center gap-1.5 text-[11px] ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-white/40'}`}>
                            {/[A-Z]/.test(password) ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-white/20"></div>}
                            1 Uppercase
                          </div>
                          <div className={`flex items-center gap-1.5 text-[11px] ${/[0-9]/.test(password) ? 'text-green-400' : 'text-white/40'}`}>
                            {/[0-9]/.test(password) ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-white/20"></div>}
                            1 Number
                          </div>
                          <div className={`flex items-center gap-1.5 text-[11px] ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-400' : 'text-white/40'}`}>
                            {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-white/20"></div>}
                            1 Special char
                          </div>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                        <X size={12} /> {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {isSignUp && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#0057FF] text-slate-400">
                        <ShieldCheck size={20} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => onConfirmPasswordChange(e.target.value)}
                        placeholder=" "
                        className={`peer w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white focus:bg-white/15 focus:border-[#0057FF] focus:ring-4 focus:ring-[#0057FF]/20 outline-none transition-all duration-300 placeholder-transparent h-[64px] ${errors.confirmPassword ? 'border-red-400/50 focus:border-red-400' : ''}`}
                      />
                      <label
                        htmlFor="confirmPassword"
                        className="absolute left-12 top-4 text-white/60 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#0057FF] peer-focus:px-2 peer-focus:rounded-lg peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:bg-blue-600 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded-lg"
                      >
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {confirmPassword && (
                        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 animate-in zoom-in duration-300">
                          {password === confirmPassword ? (
                            <Check size={18} className="text-green-400" />
                          ) : (
                            <X size={18} className="text-red-400" />
                          )}
                        </div>
                      )}
                      {errors.confirmPassword && (
                        <p className="text-red-200 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X size={12} /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Terms & Conditions (Sign Up Only) */}
                  {isSignUp && (
                    <div className="flex items-start gap-3 px-1 mt-2">
                      <div className="flex items-center h-6">
                        <input
                          id="terms"
                          type="checkbox"
                          className="w-5 h-5 rounded-lg bg-white/10 border-white/20 text-[#0057FF] focus:ring-[#0057FF] focus:ring-offset-0 transition-all cursor-pointer"
                          required
                        />
                      </div>
                      <label htmlFor="terms" className="text-sm text-white/70 leading-tight cursor-pointer select-none">
                        I agree to the <a href="#" className="text-white hover:text-blue-300 underline font-medium">Terms</a> & <a href="#" className="text-white hover:text-blue-300 underline font-medium">Privacy Policy</a>
                      </label>
                    </div>
                  )}

                  {/* Remember Me and Forgot Password (Login Only) */}
                  {!isSignUp && (
                    <div className="flex items-center justify-between px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => onRememberMeChange(e.target.checked)}
                            className="w-5 h-5 rounded-lg bg-white/10 border-white/20 text-[#0057FF] focus:ring-[#0057FF] focus:ring-offset-0 transition-all cursor-pointer peer appearance-none border-2 checked:border-[#0057FF] checked:bg-[#0057FF]"
                          />
                          <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                        </div>
                        <span className="text-sm text-white/80 group-hover:text-white transition-colors">Remember me</span>
                      </label>
                      <button
                        onClick={onToggleForgotPassword}
                        className="text-sm text-white/80 hover:text-white font-medium hover:underline transition-all"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={onSubmit}
                      disabled={loading || (isSignUp && (!password || password !== confirmPassword || passwordStrength === 'weak'))}
                      className="w-full bg-[#0057FF] hover:bg-gradient-to-r hover:from-[#0057FF] hover:to-[#3BB9FF] text-white py-4 rounded-2xl text-lg font-bold tracking-wider shadow-2xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {isSignUp ? 'SIGN UP' : 'LOGIN'}
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* OR Divider */}
                  <div className="relative flex items-center py-2 px-1">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-white/40 text-xs font-bold tracking-widest uppercase">OR</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  {/* Google Auth Button */}
                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="w-full bg-white text-slate-700 py-3.5 rounded-full font-bold hover:shadow-xl hover:bg-slate-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border-none shadow-lg shadow-black/10"
                  >
                    <Chrome size={20} className="text-[#4285F4]" />
                    Continue with Google
                  </button>
                </div>

                {/* Switch View */}
                <div className="mt-10 text-center">
                  <p className="text-white/70 text-base">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={onToggleMode}
                      className="text-white font-bold hover:underline ml-1 cursor-pointer transition-colors"
                    >
                      {isSignUp ? 'Log in' : 'Create one'}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div >
    </div >
  );
}
