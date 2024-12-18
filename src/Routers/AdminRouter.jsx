import React from 'react'
import AdminLoginPage from '../Pages/Admin/AdminLoginPage'
import AdminSalesReportPage from '../Pages/Admin/AdminSalesReportPage'
import AdminLayout from '../Components/layout/Admin/AdminLayout/AdminLayout'
import AdminProductsPage from '../Pages/Admin/AdminProductsPage'
import AdminUsersPage from '../Pages/Admin/AdminUsersPage'
import AdminCategoryPage from '../Pages/Admin/AdminCategoryPage'
import AdminAddProductPage from '../Pages/Admin/AdminAddProductPage'
import AdminEditProductPage from '../Pages/Admin/AdminEditProductPage'
import AdminAuth from '../Utils/Protector/AdminAuth'
import AdminPrivate from '../Utils/Protector/AdminPrivate'
import { AdminOdersPage, AdminOrdersDetailesPage } from '../Pages/Admin/AdminOdersPage'
import {AdminCouponsPage,AdminAddCouponsPage} from '../Pages/Admin/AdminCouponsPage'
import {AdminOffersPage, AdminAddOffersPage} from '../Pages/Admin/AdminOffersPage'
import AdminDashboardPage from '../Pages/Admin/AdminDashboardPage'


const adminRoutes=[
  {
    path:'/admin/login',
    element:
    <AdminAuth>
      <AdminLoginPage/>
    </AdminAuth>
  },

  {
    path:'/admin',
    element:
    <AdminPrivate>
      < AdminLayout/>,
    </AdminPrivate>, 

    children:[

      {
        path: 'dashboard',
        element: <AdminDashboardPage/>
      },

      {
        path: 'sales-report',
        element: <AdminSalesReportPage/>
      },

      {
        path: 'products',
        element: <AdminProductsPage/>
      },

      {
        path: 'users',
        element: <AdminUsersPage/>
      },

      {
        path: 'category',
        element: <AdminCategoryPage/>
      },

      {
        path: 'addproduct',
        element: <AdminAddProductPage/>
      },
      
      {
        path: 'EditProduct/:product_id',
        element: <AdminEditProductPage/>
      },

      {
        path:'orders',
        element: <AdminOdersPage/>
      },
      
      {
        path:'ordersdetails/:userId',
        element: <AdminOrdersDetailesPage/>
      },

      {
        path: 'coupons',
        element: <AdminCouponsPage/>
      },

      {
        path:'offers',
        element: <AdminOffersPage/>
      },

      {
        path:'add-coupon',
        element: <AdminAddCouponsPage/>
      },

      {
        path:'add-offers',
        element: <AdminAddOffersPage/>
      }

    ]
  }
]

export default adminRoutes

