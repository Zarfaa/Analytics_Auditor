import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/Analytics_Audtor_logo.png";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; 

function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
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

      toast.success(`Welcome, ${user.displayName}! You’re all set to use Analytics Auditor.`);
    } catch (err) {
      setError(err.message);
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
      >

        <div className="bg-primary-light p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-primary-dark">Almost done!</h2>
            <p className="text-sm text-white/80">Link Google to complete setup</p>
          </div>
          <img src={logo} alt="Analytics Auditor Logo" className="h-8 w-auto" />
        </div>


        <div className="p-8 text-center space-y-6">
          <p className="text-sm text-gray-600">
            Sign in with your Google account to start your onboarding process.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl shadow-md transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              className="h-5 w-5"
            />
            {loading ? "Signing you in..." : "Sign in with Google"}
          </motion.button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <p className="text-xs text-gray-400 mt-4">
            We’ll never post or share anything without your permission.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
