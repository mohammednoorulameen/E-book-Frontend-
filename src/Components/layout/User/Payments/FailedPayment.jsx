import React from 'react'
import { useNavigate } from 'react-router-dom'


const FailedPayment = () => {

  const navigate = useNavigate()
  return (
    <div>
        
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
    <div className="flex items-center justify-center mb-4">
      <div className="bg-red-100 p-3 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M9.172 9.172a4 4 0 015.656 0M15 15h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m0 6H9m0-6H7a2 2 0 00-2 2v2a2 2 0 002 2h2"
          />
        </svg>
      </div>
    </div>
    <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
    <p className="text-gray-600 mt-2">
      Oops! Order is placed. Your payment could not be processed.
    </p>
    <div className="mt-6 flex gap-4 justify-center">
      {/* <button
        onClick={() => console.log("Retry Payment")}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
      >
        Retry Payment
      </button> */}
       <button
        onClick={() => navigate('/shop')}
        className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-grey-700 transition duration-200"
      >
        Continue
      </button>
      <button
        onClick={() => navigate('/account/orders')}
        className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
      >
        Go to Orders
      </button>
    </div>
    <div className="mt-4">
      <a
        href="#"
        className="text-sm text-gray-600 underline hover:text-gray-900"
      >
        Contact Support
      </a>
    </div>
  </div>
</div>

    </div>
  )
}

export default FailedPayment



