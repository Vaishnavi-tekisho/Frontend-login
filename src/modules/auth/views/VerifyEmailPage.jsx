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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-600 to-indigo-900 px-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        ? 'bg-blue-500/20 text-blue-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30'
                        }`}
                >
                    {loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
                </button>

                <button
                    onClick={onBackToLogin}
                    className="w-full py-4 text-blue-200 hover:text-white font-medium transition-colors"
                >
                    Back to login
                </button>

                <p className="mt-8 text-sm text-blue-200/60">
                    Can't find the email? Check your spam folder or wait a few minutes before resending.
                </p>
            </div>
        </div>
    );
}
