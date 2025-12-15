import React, { useState } from "react";
import axios from "axios";
 
const ForgotPassword = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
 
  const handleSendOTP = async () => {
    try {
      const response = await axios.post("/generate-otp", { email });
      setMessage(response.data.message);
      navigate("/otp-verification", { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred");
    }
  };
 
  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
};
 
export default ForgotPassword;