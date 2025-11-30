import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (name: { firstName: string; lastName?: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLogin = () => {
    if (firstName.trim()) {
      onLogin({ firstName: firstName.trim(), lastName: lastName.trim() });
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center w-full max-w-md">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mx-auto mb-4 tracking-wide">SONIC AI</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12">Feel the Magic in Every Beat</p>

        <div className="space-y-4 w-full max-w-xs mx-auto">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name (required)"
            className="w-full text-center bg-white/30 backdrop-blur-lg text-white placeholder-white/80 font-semibold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name (optional)"
            className="w-full text-center bg-white/30 backdrop-blur-lg text-white placeholder-white/80 font-semibold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            onClick={handleLogin}
            disabled={!firstName.trim()}
            className="w-full bg-white/30 backdrop-blur-lg text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all hover:scale-105 text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </div>

        <p className="text-xs text-white/70 mt-8 px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;