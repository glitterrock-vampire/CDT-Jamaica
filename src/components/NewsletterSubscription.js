import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const NewsletterSubscription = ({ className = '' }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Use the full URL in development, relative in production
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001/api/subscribe' 
        : '/api/subscribe';

      console.log('Sending request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
        credentials: 'same-origin' // Important for cookies, authorization headers
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid server response');
      }
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
      }
      setMessage(data.message || (data.error || 'Something went wrong'));
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className={`flex border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-neutral-900 shadow-[0_12px_30px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-orange-500/50`}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 text-sm bg-transparent border-none focus:ring-0 focus:outline-none ${
                    isDarkMode 
                    ? 'text-gray-100 placeholder-gray-400' 
                    : 'text-gray-800 placeholder-gray-500'
                }`}
                required
                disabled={status === 'loading'}
                />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`
              px-6 py-3 text-sm font-medium tracking-wide
              transition-all duration-200 border-l border-black/10 dark:border-white/10
              ${
                status === 'loading'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-wait' 
                  : 'bg-orange-500 text-white hover:bg-orange-600 dark:hover:bg-orange-400'
              }
              focus:outline-none
              disabled:opacity-70
            `}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Subscribing</span>
              </span>
            ) : (
              <span className="flex items-center">
                <span>Subscribe</span>
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            )}
          </button>
        </div>
        {message && (
          <p
            className={`text-sm mt-2 ${
              status === 'error' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default NewsletterSubscription;
