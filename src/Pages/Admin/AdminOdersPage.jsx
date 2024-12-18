import React from 'react'
import AdminOders from '../../Components/layout/Admin/AdminOders/AdminOders'
import AdminOrdersDetailes from '../../Components/layout/Admin/AdminOders/AdminOrdersDetailes'

const AdminOdersPage = () => {
  return (
    <div>
        <AdminOders/>
    </div>
  )
}

/**
 * admin orders detailes page
 */
const AdminOrdersDetailesPage = () => {
  return (
    <div>
      <AdminOrdersDetailes/>
    </div>
  )
}

export  {
  AdminOrdersDetailesPage,
  AdminOdersPage

}