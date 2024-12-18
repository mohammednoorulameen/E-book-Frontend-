
import React from 'react';


function Error() {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-gray-700 select-none animate-float">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-20 w-20 text-red-500 animate-spin-slow" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M11 17l-5-5m0 0l5-5m-5 5h12" 
              />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-xl text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        <p className="mt-2 text-gray-500">It might have been moved or deleted.</p>
        <a 
          href="/"
          className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-all duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default Error;
