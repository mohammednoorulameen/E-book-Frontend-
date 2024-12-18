import React from "react";
import AdminCoupons from "../../Components/layout/Admin/AdminCoupons/AdminCoupons";
import AdminAddCoupons from "../../Components/layout/Admin/AdminCoupons/AdminAddCoupons";

const AdminCouponsPage = () => {
  return (
    <div>
      <AdminCoupons />
    </div>
  );
};

const AdminAddCouponsPage = () => {
  return (
   <div>
    <AdminAddCoupons/> 
  </div>
  );
};

export { AdminCouponsPage, AdminAddCouponsPage };
