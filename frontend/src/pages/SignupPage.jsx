import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import MensahesLogo from "../assets/MensahesLogo.png";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);
  const [hasValue, setHasValue] = useState(false);

  {/* Data Need to be filled */}
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    gender: '',
    profilePicture: '',
  });

  const { signup, isSigningUp } = useAuthStore();
  const totalSteps = 4;

  {/* Validation Functions for Email it states that the symbols and element below are the only exception */}
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  {/* Validation Function for Mobile it states that the symbols, letter and element are not allowed only numbers */}
  const validateMobile = (mobile) => {
    return /^\+?\d{10,15}$/.test(mobile);
  };

  {/* Validation Functions for Password it states that the password must be at least 8 characters long */}
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  {/* Validation function for each step of the form, it checks if the required fields are filled*/}
  const validateStep = (step) => {
    let stepErrors = {};
    
    switch (step) {
      case 1:
        // Check if first name and last name are not empty
        if (!formData.fname.trim()) stepErrors.fname = 'First name is required';
        if (!formData.lname.trim()) stepErrors.lname = 'Last name is required';
        break;
      case 2:
        // Check if either email or mobile is provided and valid
        if (!formData.email.trim() && !formData.mobile.trim()) {
          stepErrors.email = 'Email or mobile number is required';
        }
        if (formData.email && !validateEmail(formData.email)) {
          stepErrors.email = 'Please enter a valid email';
        }
        if (formData.mobile && !validateMobile(formData.mobile)) {
          stepErrors.mobile = 'Please enter a valid mobile number';
        }
        break;
      case 3:
        // Check if password, confirm password, birthday, and gender are valid and not empty
        if (!formData.password) stepErrors.password = 'Password is required';
        if (!validatePassword(formData.password)) stepErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = 'Passwords do not match';
        if (!formData.birthday) stepErrors.birthday = 'Birthday is required';
        if (!formData.gender) stepErrors.gender = 'Gender is required';
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateForm = () => {
    const { fname, lname, email, mobile, password, confirmPassword, birthday, gender } = formData;
    return fname && lname && (validateEmail(email) || mobile) && validatePassword(password) && password === confirmPassword && birthday && gender;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const markStepTouched = (step) => {
    const fields = {};
    switch (step) {
      case 1:
        fields.fname = true;
        fields.lname = true;
        break;
      case 2:
        fields.email = true;
        fields.mobile = true;
        break;
      case 3:
        fields.password = true;
        fields.confirmPassword = true;
        fields.birthday = true;
        fields.gender = true;
        break;
      case 4:
        fields.profilePicture = true;
        break;
    }
    setTouched((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      markStepTouched(currentStep);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }
    await signup(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Branding & Info (Facebook Style) */}
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
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Find Friends</h3>
                  <p className="text-gray-600 text-sm">Discover and connect with people you know</p>
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

          {/* Right Column - Signup Form */}
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-auto lg:mx-0">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
              <p className="text-gray-600 text-sm">Step <span className="font-semibold text-green-600">{currentStep}</span> of <span className="font-semibold">{totalSteps}</span></p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      step <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
              {/* Step 1: Name */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">What's your name?</h3>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">First Name *</label>
                    <input
                      type="text"
                      name="fname"
                      value={formData.fname}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="John"
                      className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                        errors.fname ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-green-600'
                      }`}
                    />
                    {errors.fname && touched.fname && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fname}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lname"
                      value={formData.lname}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Doe"
                      className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                        errors.lname ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-green-600'
                      }`}
                    />
                    {errors.lname && touched.lname && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lname}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Email & Mobile */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">How can we reach you?</h3>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                        errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.email && (touched.email || touched.mobile) && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="+63 900 123 4567"
                      className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                        'border-gray-300 focus:border-blue-600'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Password, Birthday & Gender */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Secure your account</h3>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                          handleInputChange(e);
                          setHasValue(e.target.value.length > 0);
                        }}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                          errors.password 
                            ? 'border-red-500 focus:border-red-600' 
                            : 'border-gray-300 focus:border-blue-600'
                        }`}
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
                    {errors.password && touched.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Re-enter your password"
                      className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none transition ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">Birthday *</label>
                      <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 focus:outline-none transition ${
                          errors.birthday ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                        }`}
                      />
                      {errors.birthday && touched.birthday && <p className="text-red-500 text-xs mt-1 font-medium">{errors.birthday}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-800 focus:outline-none transition ${
                          errors.gender ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && touched.gender && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gender}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Profile Picture */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Add a profile picture</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      id="profilePictureInput"
                    />
                    <label htmlFor="profilePictureInput" className="cursor-pointer block">
                      {profilePreview ? (
                        <div className="space-y-3">
                          <img src={profilePreview} alt="Profile preview" className="w-20 h-20 rounded-full mx-auto object-cover" />
                          <p className="text-sm text-gray-600">Click to change photo</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-3xl">📷</p>
                          <p className="text-gray-700 font-medium">Add a profile picture</p>
                          <p className="text-xs text-gray-500">JPG, PNG or GIF (4MB max)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <p className="text-gray-800 font-semibold mb-3 text-sm">Review your information:</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{formData.fname} {formData.lname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-semibold">{formData.email || formData.mobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Birthday:</span>
                        <span className="font-semibold">{formData.birthday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-semibold capitalize">{formData.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Back
                  </button>
                )}
                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    Next
                  </button>
                )}
                {currentStep === totalSteps && (
                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
                  >
                    {isSigningUp ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </form>

            {/* Footer Link */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account? <a href="/login" className="text-green-500 font-semibold hover:underline">Login</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
