import React from 'react'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
    const navigate = useNavigate()
  return (
    <div>
        <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">


  <main class="flex-grow w-full flex flex-col items-center text-center mt-8">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <div class="text-green-500">
        <svg class="w-16 h-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7 12l-2-2m4-4h.01M3 10h.01M21 16h.01M3 20h.01M21 8h.01" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold mt-4">Payment Successful!</h2>
      <p class="text-gray-600 mt-2">Thank you for your payment. Your transaction has been completed successfully.</p>
      
      {/* <div class="mt-6 text-left">
        <div class="flex justify-between">
          <span class="font-medium">Order ID:</span>
          <span>#12345678</span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="font-medium">Date:</span>
          <span>December 4, 2024</span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="font-medium">Amount Paid:</span>
          <span>$150.00</span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="font-medium">Payment Method:</span>
          <span>Credit Card</span>
        </div>
      </div> */}

      <div class="mt-6">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2">View Receipt</button>
        <button onClick={()=> navigate('/account/orders')} class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">View Order Details</button>
      </div>
    </div>
  </main>

  <footer class="w-full py-4 bg-white mt-8 shadow-t">
    <div class="max-w-6xl mx-auto text-center">
      <p class="text-sm text-gray-500">Need help? Contact us at <a href="mailto:support@example.com" class="text-blue-600 hover:underline">support@example.com</a> or call 123-456-7890.</p>
      <p class="text-sm text-gray-500 mt-2">Refund Policy | Terms & Conditions</p>
    </div>
  </footer>
</div>

    </div>
  )
}

export default PaymentSuccess


