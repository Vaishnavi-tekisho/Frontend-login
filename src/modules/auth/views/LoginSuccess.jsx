/**
 * Login Success View Component
 * Simple success message after login
 */
import React from 'react';

export default function LoginSuccess({ userData, onLogout }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-10 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Login Successful!</h1>
          <p className="text-gray-400">Welcome back, {userData?.name || 'User'}</p>
        </div>

        <button
          onClick={onLogout}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
