import React from "react";
import Account from "../../Components/layout/User/Account/Account";
import EditProfile from "../../Components/layout/User/Account/EditProfile";
import ChangePassword from "../../Components/layout/User/Account/ChangePassword";
import ManageAddress from "../../Components/layout/User/Account/ManageAddress";
import { OrderHistory, OrderHistoryProductDetailes } from "../../Components/layout/User/Account/OrderHistory";
import Setting from "../../Components/layout/User/Account/Settings";
import Wallet from "../../Components/layout/User/Account/Wallet";
import Referrals from "../../Components/layout/User/Account/Referrals";
import Notifications from "../../Components/layout/User/Account/Notifications";

const AccountPage = () => {
  return (
    <div>
      <Account />
    </div>
  );
};

const EditProfilePage = () => {
  return (
    <div>
      <EditProfile />
    </div>
  );
};

const ChangePasswordPage = () => {
  return (
    <div>
      <ChangePassword />
    </div>
  );
};

const ManageAddressPage = () => {
  return (
    <div>
      <ManageAddress />
    </div>
  );
};

const OrderHistoryPage = () => {
  return (
    <div>
      <OrderHistory />
    </div>
  );
};

const OrderHistoryProductDetailesPage = () => {
  return (
    <div>
      <OrderHistoryProductDetailes/>
    </div>
  );
};

const WalletPage = () => {
  return (
    <div>
      <Wallet />
    </div>
  );
};

const ReferralsPage = () => {
  return (
    <div>
      <Referrals />
    </div>
  );
};

const NotificationsPage = () => {
  return (
    <div>
      <Notifications />
    </div>
  );
};
const SettingsPage = () => {
  return (
    <div>
      <Setting />
    </div>
  );
};

export {
  AccountPage,
  EditProfilePage,
  ChangePasswordPage,
  ManageAddressPage,
  OrderHistoryPage,
  OrderHistoryProductDetailesPage,
  WalletPage,
  ReferralsPage,
  NotificationsPage,
  SettingsPage,
};
