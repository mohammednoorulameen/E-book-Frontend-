import SignupPage from "../Pages/User/SignupPage";
import LoginPage from "../Pages/User/LoginPage";
import HomePage from "../Pages/User/HomePage";
import Header from "../Components/Common/Header";
import { Outlet } from "react-router-dom";
import OtpPage from "../Pages/User/OtpPage";
import Footer from "../Components/Common/Footer";
import ShopPage from "../Pages/User/ShopPage";
import ProductDetailsPage from "../Pages/User/ProductDetailsPage";
import UserAuthenticated from "../Utils/Protector/UserAuthenticated";
import CartPage from '../Pages/User/CartPage'
import {
  AccountPage,
  EditProfilePage,
  ChangePasswordPage,
  ManageAddressPage,
  OrderHistoryPage,
  OrderHistoryProductDetailesPage,
  SettingsPage,
  WalletPage,
  ReferralsPage,
  NotificationsPage
} from "../Pages/User/AccountPage";
import UserPrivate from "../Utils/Protector/UserPrivate";
import ForgotPasswordPage from "../Pages/User/ForgotPasswordPage";
import CheckOutPage from "../Pages/User/CheckOutPage";
import {FailedPaymentPage, NewOrderPaymentPage, PaymentSuccessPage} from "../Pages/User/PaymentsPage";
import WhishlistPage from "../Pages/User/WhishlistPage";
import Error from "../Components/Common/Error";


const UserRouter = [
  {
    path: "/",
    element: (
      <>
        <Header />
        <div>
          <Outlet />
        </div>

        <Footer />
      </>
    ),

    children: [
      {
        path: "",
        element: <HomePage />,
      },

      {
        path: "register",
        element: (
          <UserAuthenticated>
            <SignupPage />
          </UserAuthenticated>
        ),
      },

      {
        path: "/verifyotp/:userId",
        element: (
          <UserAuthenticated>
            <OtpPage />
          </UserAuthenticated>
        ),
      },

      {
        path: "/login",
        element: (
          <UserAuthenticated>
            <LoginPage />
            {/* //{" "} */}
          </UserAuthenticated>
        ),
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
      },

      {
        path: "/shop",
        element: <ShopPage />,
      },

      {
        path: "/productdetails/:product_id",
        element: <ProductDetailsPage />,
      },

      {
        path: "/account",
        element: (
          <UserPrivate>
            {" "}
            <AccountPage />{" "}
          </UserPrivate>
        ),
        children: [
          {
            path: "edit-profile",
            element: <EditProfilePage />,
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "manage-address",
            element: <ManageAddressPage />,
          },
          {
            path: "orders",
            element: <OrderHistoryPage />,
          },
          {
            path:'wallet',
            element: < WalletPage/>
          },
          {
            path:'referrals',
            element: < ReferralsPage/>
          },
          {
            path:'notifications',
            element: <NotificationsPage/>
          },
           {
            path:'settings',
            element: < SettingsPage/>
          }
        ],
      },

      {
        path: "/orderdetails/:productId",
        element: <OrderHistoryProductDetailesPage/>
      },

      {
        path: "/cart",
        element: <UserPrivate>
          <CartPage/>
        </UserPrivate>
      },

      {
        path:"/check-out",
        element: <CheckOutPage/>

      },

      {
        path:"/new-order-payment",
        element: <NewOrderPaymentPage/>
      },

      {
        path: "/payment-success",
        element: <PaymentSuccessPage/>
      },

      {
        path: "/payment-failed",
        element : <FailedPaymentPage/>
      },

      {
        path: "/whishlist",
        element : <WhishlistPage/>
      },

      {
        path: "*",
        element : <Error/>
      }

    ],
  },
];

export default UserRouter;


