import React from 'react'
import NewOrderPayment from '../../Components/layout/User/Payments/NewOrderPayment'
import PaymentSuccess from '../../Components/layout/User/Payments/PaymentSuccess'
import FailedPayment from '../../Components/layout/User/Payments/FailedPayment'

/**
 * New Order Payment Page
 */

const NewOrderPaymentPage = () => {
  return (
    <div>
        <NewOrderPayment/>
    </div>
  )
}


const PaymentSuccessPage = () =>{
  return(
    <div>
      <PaymentSuccess/>
    </div>
  )
}

const FailedPaymentPage = () =>{
  return (
    <div>
      <FailedPayment/>
    </div>
  )
}

export  {NewOrderPaymentPage, PaymentSuccessPage, FailedPaymentPage}