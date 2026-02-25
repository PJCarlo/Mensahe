
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import MensahesLogo from '../assets/MensahesLogo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoggingIn } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setGeneralError(errorData.message || 'Login failed. Please try again.');
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);
      navigate('/messages');
    } catch (error) {
      setGeneralError('Connection error. Please check your internet and try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Branding & Info */}
          <div className="hidden lg:block text-left">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <img src={MensahesLogo} alt="Mensahe Logo" className="w-16 h-16 mb-2" />
                <h1 className="text-5xl font-bold text-green-500">Mensahe</h1>
              </div>
              <p className="text-xl text-gray-700 font-semibold mb-2">Connect with friends and the world around you.</p>
              <p className="text-gray-600">Share your moments, stay in touch, and meet new people.</p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Easy Messaging</h3>
                  <p className="text-gray-600 text-sm">Stay connected with instant messaging</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">☎️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Voice & Video Calls</h3>
                  <p className="text-gray-600 text-sm">Crystal clear communication anytime</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Location Sharing</h3>
                  <p className="text-gray-600 text-sm">Share your location with friends safely</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-auto lg:mx-0">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* General Error Message */}
            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium text-sm">{generalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                    errors.email
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-green-600'
                  }`}
                  disabled={isLoggingIn}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => {
                      handleInputChange(e);
                      setHasValue(e.target.value.length > 0);
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition pr-12 ${
                      errors.password
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-green-600"
                    }`}
                    disabled={isLoggingIn}
                  />

                  {/* EYE TOGGLE */}
                  {hasValue && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 active:scale-95 transition"
                    >
                      {showPassword ? (
                        // eye-off
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2 2l20 20M10.58 10.58A3 3 0 0013.42 13.42M9.88 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 11 8-0.7 2.01-1.93 3.76-3.5 5.11M6.1 6.1C3.98 7.72 2.37 9.69 1 12c1.73 4.89 6 8 11 8 1.61 0 3.15-.32 4.56-.9"/>
                        </svg>
                      ) : (
                        // eye
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 5c-5 0-9.27 3.11-11 8 1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8zm0 13a5 5 0 110-10 5 5 0 010 10z"/>
                        </svg>
                      )}
                    </button>
                  )}

                </div>

                {errors.password && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-green-600"
                    disabled={isLoggingIn}
                  />
                  <span className="text-gray-700 text-sm">Keep me logged in</span>
                </label>
                <a 
                  href="#forgot" 
                  className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-3 rounded-lg font-bold text-white text-base transition-all duration-300 flex items-center justify-center gap-2 mt-8 ${
                  isLoggingIn
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:scale-95'
                }`}
              >
                {isLoggingIn ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Sign Up Link */}
              <div className="pt-6 border-t border-gray-300 text-center">
                <p className="text-gray-700 text-sm">
                  Don't have an account?{' '}
                  <a
                    href="/signup"
                    className="font-bold text-green-600 hover:text-green-700 transition-colors"
                  >
                    Create one
                  </a>
                </p>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center text-gray-400 text-xs space-y-2">
              <div className="flex justify-center gap-3">
                <a href="#privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
                <span className="text-gray-300">•</span>
                <a href="#terms" className="hover:text-gray-600 transition-colors">Terms</a>
                <span className="text-gray-300">•</span>
                <a href="#contact" className="hover:text-gray-600 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
