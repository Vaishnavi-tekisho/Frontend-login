import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerificationSuccessPage({
    status,
    error,
    onVerify
}) {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const token = params.get('token');
        const email = params.get('email');

        console.log('🔍 [VerificationSuccessPage] Params:', { token: !!token, email, status });

        if (token && email && status === 'verifying') {
            console.log('📧 Triggering verification...');
            onVerify(email, token);
        } else if (!token || !email) {
            console.warn('⚠️ Missing token or email in URL');
        }
    }, [params, status, onVerify]);

    // Auto-redirect after successful verification
    useEffect(() => {
        if (status === 'success') {
            console.log('✅ Verification successful, starting countdown redirect...');

            // Give a brief moment for state to sync
            setTimeout(() => {
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            console.log('🚀 Redirecting to dashboard...');
                            console.log('📦 Current localStorage:', {
                                token: !!localStorage.getItem('access_token'),
                                user: !!localStorage.getItem('user_data'),
                                tokenValue: localStorage.getItem('access_token')?.substring(0, 20) + '...',
                                userData: localStorage.getItem('user_data')
                            });
                            // Use window.location for a full page refresh to ensure state is synchronized
                            window.location.href = '/dashboard';
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => clearInterval(timer);
            }, 100); // Small delay to ensure localStorage is written
        }
    }, [status]);

    // Fallback for unknown status
    if (!['verifying', 'success', 'error'].includes(status)) {
        console.warn('⚠️ [VerificationSuccessPage] Unknown status:', status);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">We couldn't determine the verification status.</p>
                    <p className="text-xs text-gray-400 mb-4">Status received: {String(status)}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D6EFD] via-[#2B8FE6] to-[#3AA0FF] px-4">
            <div className="max-w-md w-full bg-white/15 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl text-center">

                {status === 'verifying' && (
                    <div className="py-10">
                        <div className="animate-spin w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-white">Verifying your email...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full border border-white/20">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Verified!</h2>
                        <p className="text-blue-100 mb-4">
                            Your email has been successfully verified. You now have full access to the dashboard.
                        </p>
                        <p className="text-white/80 mb-8 text-sm">
                            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </p>
                        <button
                            onClick={() => {
                                // Use window.location for a full page refresh to ensure state is synchronized
                                window.location.href = '/dashboard';
                            }}
                            className="w-full py-4 bg-[#0B5ED7] hover:bg-[#0D6EFD] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-700/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Continue to Dashboard Now
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Oops!</h2>
                        <p className="text-red-100 mb-8">{error}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-4 bg-white/15 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all"
                        >
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
