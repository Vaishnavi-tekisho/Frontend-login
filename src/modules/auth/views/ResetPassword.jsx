import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../models/authService';
import { validatePassword, validatePasswordMatch } from '../utils/validation';
export default function ResetPassword() {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        // Parse URL parameters from both Hash (Implicit) and Search (PKCE/Error)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);

        // Debugging
        console.log("Reset Password Loaded");
        console.log("Hash Params:", Object.fromEntries(hashParams.entries()));
        console.log("Search Params:", Object.fromEntries(searchParams.entries()));

        // 1. Check for Errors first
        const errorDesc = hashParams.get('error_description') || searchParams.get('error_description');
        const errorCode = hashParams.get('error') || searchParams.get('error');

        if (errorDesc) {
            setError(errorDesc.replace(/\+/g, ' ')); // Decode spaces
            return;
        }

        // 2. Check for Token (Implicit Flow)
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');

        // 3. Check for Code (PKCE Flow - though usually main auth client handles this, we can at least flag it)
        const code = hashParams.get('code') || searchParams.get('code');

        if (accessToken) {
            setToken(accessToken);
            // Clean URL
            window.history.replaceState(null, '', window.location.pathname);
        } else if (code) {
            setError('System is using PKCE flow which requires client-side exchange. Please report this to support.');
        } else {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setValidationErrors({});

        // Validation
        const passVal = validatePassword(password);
        if (!passVal.valid) {
            setValidationErrors((prev) => ({ ...prev, password: passVal.error }));
            return;
        }

        const matchVal = validatePasswordMatch(password, confirmPassword);
        if (!matchVal.valid) {
            setValidationErrors((prev) => ({ ...prev, confirmPassword: matchVal.error }));
            return;
        }

        if (!token) {
            setError('Missing reset token.');
            return;
        }

        setLoading(true);

        try {
            await AuthService.confirmPasswordReset(password, token);
            setSuccess('Password updated successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Error during password reset:', err);
            setError(err.message || 'An error occurred while resetting the password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0D6EFD] via-[#2B8FE6] to-[#3AA0FF]">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl w-full max-w-md p-10 shadow-2xl border border-white/30">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Password</h2>
                {error && <p className="text-red-200 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-200 text-sm mb-4 text-center">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-[#0B5ED7] focus:bg-white/15 outline-none transition-all"
                            required
                        />
                        {validationErrors.password && <p className="text-red-200 text-xs mt-1">{validationErrors.password}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-[#0B5ED7] focus:bg-white/15 outline-none transition-all"
                            required
                        />
                        {validationErrors.confirmPassword && <p className="text-red-200 text-xs mt-1">{validationErrors.confirmPassword}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#0B5ED7] text-white py-3 rounded-2xl font-bold hover:bg-[#0D6EFD] focus:outline-none focus:ring-2 focus:ring-[#0B5ED7] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-700/40"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
