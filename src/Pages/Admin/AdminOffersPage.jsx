import React from 'react'
import AdminOffers from '../../Components/layout/Admin/AdminOffers/AdminOffers'
import AdminAddOffers from '../../Components/layout/Admin/AdminOffers/AdminAddOffers'

const AdminOffersPage = () => {
  return (
    <div>
        <AdminOffers/>
    </div>
  )
}



const AdminAddOffersPage = () => {
  return (
    <div>
      <AdminAddOffers/>
    </div>
  )
}


export  {AdminOffersPage, AdminAddOffersPage}