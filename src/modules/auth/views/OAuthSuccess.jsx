/**
 * OAuth Success View Component
 * Handles OAuth callback and redirects
 */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthService } from "../models/authService";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = params.get("token");
    const userDataParam = params.get("user");
    const errorParam = params.get("error");
    
    console.log("🔍 OAuth Callback Received");
    console.log("✅ TOKEN FROM GOOGLE:", token);
    console.log("✅ USER DATA FROM GOOGLE:", userDataParam);
    console.log("❌ ERROR FROM OAUTH:", errorParam);

    if (errorParam) {
      setError(`OAuth Error: ${errorParam}`);
      console.error("OAuth Error:", errorParam);
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    if (token) {
      try {
        // Use AuthService to store token and user data
        AuthService.storeToken(token, true); // Remember OAuth users
        console.log("✅ Token stored successfully");
        
        if (userDataParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataParam));
            AuthService.storeUserData(userData);
            console.log("✅ User data stored:", userData);
          } catch (e) {
            console.warn("⚠️ Could not parse user data:", e);
          }
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } catch (err) {
        console.error("❌ Error storing token:", err);
        setError("Failed to store authentication token");
        setTimeout(() => navigate("/"), 3000);
      }
    } else {
      console.warn("⚠️ No token received from OAuth provider");
      setError("No authentication token received. Please try again.");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [params, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {error ? (
        <div>
          <h2 style={{ color: "red" }}>Authentication Error</h2>
          <p>{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <h2>Logging in with Google...</h2>
      )}
    </div>
  );
}



