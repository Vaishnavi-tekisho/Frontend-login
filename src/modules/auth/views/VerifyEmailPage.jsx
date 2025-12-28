import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailPage({
    userData,
    loading,
    message,
    error,
    cooldown,
    onResend,
    onBackToLogin
}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        } else if (userData.email_verified) {
            navigate('/dashboard');
        }
    }, [userData, navigate]);

    if (!userData) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D6EFD] via-[#2B8FE6] to-[#3AA0FF] px-4">
            <div className="max-w-md w-full bg-white/15 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl text-center">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full border border-white/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-blue-100 mb-8">
                    We’ve sent a verification link to your mail.<br />
                    Please check your inbox and click the link to activate your account.
                </p>

                {message && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-6">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <button
                    onClick={() => onResend(userData.email)}
                    disabled={loading || cooldown > 0}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-4 ${(loading || cooldown > 0)
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-[#0B5ED7] hover:bg-[#0D6EFD] text-white shadow-lg shadow-blue-700/40'
                        }`}
                >
                    {loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
                </button>

                <button
                    onClick={onBackToLogin}
                    className="w-full py-4 text-white/70 hover:text-white font-medium transition-colors"
                >
                    Back to login
                </button>

                <p className="mt-8 text-sm text-white/60">
                    Can't find the email? Check your spam folder or wait a few minutes before resending.
                </p>
            </div>
        </div>
    );
}
