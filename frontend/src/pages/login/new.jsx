import React, { useState } from 'react';

export default function LibraryLoginPortal() {
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'password'
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', inputValue);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-between px-8 md:px-20 lg:px-32 bg-cover bg-center bg-no-repeat font-sans"
         style={{
           // Modern atmospheric library bookshelf background
           backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')`
         }}>
      
      {/* LEFT SECTION: Branding & Text */}
      <div className="max-w-lg text-white z-10 hidden md:block">
        <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2 block">
          Library Management System
        </span>
        
        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-md">
          Library Portal.
        </h1>
        
        <p className="text-gray-200 text-base lg:text-lg leading-relaxed opacity-90">
          Our digital portal streamlines book discovery, automated circulation, and member management—bringing everything together in one seamlessly connected workspace.
        </p>
      </div>

      {/* RIGHT SECTION: Floating White Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl z-10 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Toggle Button Container */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                authMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                authMethod === 'password'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Password
            </button>
          </div>

          {/* Input Field */}
          <div>
            <input
              type={authMethod === 'email' ? 'email' : 'password'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={authMethod === 'email' ? 'Your Email Address' : 'Enter Your Password'}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
          >
            {authMethod === 'email' ? 'Send Link' : 'Log In'}
          </button>
        </form>
      </div>

    </div>
  );
}