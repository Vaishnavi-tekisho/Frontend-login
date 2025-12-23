import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerificationSuccessPage({
    status,
    error,
    onVerify
}) {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get('token');
        const email = params.get('email');

        if (token && email && status === 'verifying') {
            onVerify(email, token);
        } else if (!token || !email) {
            // Already handled by component if status is success/error
        }
    }, [params, status, onVerify]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-700 to-cyan-800 px-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center">

                {status === 'verifying' && (
                    <div className="py-10">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-white">Verifying your email...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full">
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Verified!</h2>
                        <p className="text-emerald-100 mb-8">
                            Your email has been successfully verified. You now have full access to the dashboard.
                        </p>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Continue to Dashboard
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
                            className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-lg transition-all"
                        >
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
