import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HealthBar } from '../components/HealthBar'; 

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Login card */}
        <div className="relative">
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
          
          <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo/Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full">
                    <span className="text-5xl">🎮</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
                  Quiz Quest
                </span>
              </h1>
              <p className="text-gray-400 text-lg">Ready for the adventure?</p>
            </div>

            {/* Decorative health bar */}
            <div className="mb-6">
              <HealthBar value={80} color="blue" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>🔥 Energy Level</span>
                <span>80/100</span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              
              {/* Email field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-gray-300 flex items-center gap-2"
                >
                  <span className="text-lg">👤</span>
                  Adventurer Name (Email)
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 hover:from-purple-500/10 hover:via-pink-500/10 hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-300 flex items-center gap-2"
                >
                  <span className="text-lg">🔐</span>
                  Secret Code (Password)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 hover:from-purple-500/10 hover:via-pink-500/10 hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <button 
                  type="button"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative w-full py-4 font-bold text-white rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {/* Button background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 transition-all duration-300 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-blue-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Button text */}
                <span className="relative flex items-center justify-center gap-2 text-lg">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <span>Start Adventure</span>
                      <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-xl">🎮</span>
                  <span className="font-medium">Discord</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-xl">🌐</span>
                  <span className="font-medium">Google</span>
                </button>
              </div>

              {/* Sign up link */}
              <div className="text-center pt-4">
                <p className="text-gray-400">
                  New to Quiz Quest?{' '}
                  <button 
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-3">
            <div className="text-2xl font-bold text-purple-400">1.2K+</div>
            <div className="text-xs text-gray-500">Active Players</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-3">
            <div className="text-2xl font-bold text-pink-400">500+</div>
            <div className="text-xs text-gray-500">Quizzes</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-3">
            <div className="text-2xl font-bold text-blue-400">24/7</div>
            <div className="text-xs text-gray-500">Support</div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};