import React, { useState } from "react";
// For debug: generate a unique instance ID
const getInstanceId = () => Math.random().toString(36).substring(2, 10);
import axios from "axios";

const ForgotPassword = () => {
  const [instanceId] = useState(getInstanceId());
  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    console.log("Sending OTP...");
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      console.log("API Response:", response.data);
      setMessage(response.data.message || "OTP sent to your email");
      setStep("OTP");
      console.log("Step updated to:", step); // Debugging log
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(error.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.post("/auth/verify-otp", { email, otp });
      setMessage(response.data.message || "OTP verified. Please reset your password.");
      setStep("RESET");
    } catch (error) {
      setError(error.response?.data?.detail || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post("/auth/reset-password", { email, otp, new_password: newPassword });
      setMessage(response.data.message || "Password reset successful. You can now log in.");
      setStep("DONE");
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      {/* Debug: Show current step and instance ID */}
      <pre style={{ color: 'gray', fontSize: '0.9em' }}>Current step: {step} | Instance ID: {instanceId}</pre>
      {step === "EMAIL" && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleSendOTP} disabled={loading || !email}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}
      {step === "OTP" && (
        <>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
            {[...Array(6)].map((_, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[idx] || ''}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (!val) return;
                  const newOtp = otp.split('');
                  newOtp[idx] = val;
                  setOtp(newOtp.join('').slice(0, 6));
                  // Move to next box
                  if (e.target.nextSibling) e.target.nextSibling.focus();
                }}
                onKeyDown={e => {
                  if (e.key === 'Backspace') {
                    const newOtp = otp.split('');
                    newOtp[idx] = '';
                    setOtp(newOtp.join(''));
                    if (e.target.previousSibling) e.target.previousSibling.focus();
                  }
                }}
                style={{ width: '2.5em', height: '2.5em', textAlign: 'center', fontSize: '1.5em', border: '1px solid #ccc', borderRadius: '6px' }}
                disabled={loading}
              />
            ))}
          </div>
          <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
      {step === "RESET" && (
        <>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleResetPassword} disabled={loading || !newPassword || !confirmPassword}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
      {step === "DONE" && (
        <p>Password reset successful! You can now log in.</p>
      )}
      {/* Move error and message below all steps for clarity */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;