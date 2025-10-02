import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/Analytics_Audtor_logo.png";
import toast from "react-hot-toast";

function Login({ onLogin }) {
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        uid: user.uid,
      };

      if (onLogin) onLogin(userInfo);

      toast.success(`Welcome ${user.displayName}! Onboarding successful 🎉`);
    } catch (err) {
      setError(err.message);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-ultra-light px-4 sm:px-6">
      <div className="card w-full max-w-md shadow-xl bg-neutral-ultra-light rounded-xl">
        <div className="bg-primary-light p-4 sm:p-6 rounded-t-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-primary">Welcome!</h2>
            <p className="text-xs sm:text-sm text-white">Authenticate to continue</p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <img src={logo} alt="Analytics Auditor Logo" className="h-8 w-auto" />
          </div>
        </div>

        <div className="p-8 space-y-6 flex flex-col items-center text-center my-8 ">
          <p className="text-sm text-gray-600 max-w-sm">
            Please authenticate with your Google account to start your onboarding process.
          </p>
          <div
            className="p-2 space-y-2 flex flex-col items-center bg-primary-light text-center my-8 
                border border-gray-300 text-primary-dark 
                w-full h-full rounded-xl shadow-lg transition duration-200"
          >
            <h2 className="text-xl font-bold text-primary max-w-sm">Sign In With</h2>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center bg-white w-10 h-10 rounded-full"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Logo"
                className="h-6 w-6"
              />
            </button>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
