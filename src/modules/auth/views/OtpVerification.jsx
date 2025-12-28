import React from 'react';

export default function OtpVerification({
  otp,
  onOtpChange,
  onVerifyOtp,
  loading,
  error,
  success
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0D6EFD] via-[#2B8FE6] to-[#3AA0FF]">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl w-full max-w-md p-10 shadow-2xl border border-white/30">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Verify OTP</h2>
        {error && <p className="text-red-200 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-200 text-sm mb-4 text-center">{success}</p>}
        <form onSubmit={onVerifyOtp}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-2">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={onOtpChange}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:border-[#0B5ED7] focus:bg-white/15 outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0B5ED7] text-white py-3 rounded-2xl font-bold hover:bg-[#0D6EFD] focus:outline-none focus:ring-2 focus:ring-[#0B5ED7] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-700/40"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}