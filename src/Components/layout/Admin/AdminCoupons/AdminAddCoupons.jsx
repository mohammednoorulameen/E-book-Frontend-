import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAddCouponMutation } from "../../../../Services/Apis/AdminApi";

const validationSchema = Yup.object().shape({
  couponName: Yup.string()
    .max(20, "Coupon name cannot exceed 20 characters")
    .required("Coupon name is required"),
  couponCode: Yup.string()
    .max(20, "Coupon code cannot exceed 20 characters")
    .required("Coupon code is required"),
  startDate: Yup.date().required("Start date is required"),
  minimumAmount: Yup.number()
    .positive("Minimum amount must be greater than zero")
    .required("Minimum amount is required"),
  expireDate: Yup.date()
    .min(Yup.ref("startDate"), "Expire date must be after the start date")
    .required("Expire date is required"),
  offer: Yup.number()
    .positive("Offer amount must be greater than zero")
    .required("Offer amount is required"),
  description: Yup.string()
    .max(100, "Description cannot exceed 100 characters")
    .required("Description is required"),
});

const AdminAddCoupon = () => {
  const navigate = useNavigate();
  const [AddCoupon] = useAddCouponMutation();

  const formik = useFormik({
    initialValues: {
      couponName: "",
      couponCode: "",
      startDate: "",
      minimumAmount: "",
      expireDate: "",
      offer: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form Values:", values);
      const response = await AddCoupon(values);
      if (response.data) {
        alert("Coupon added successfully!");
      }
      navigate("/admin/coupons");
    },
  });
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">ADD - COUPONS</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Coupon Name</label>
          <input
            type="text"
            id="couponName"
            name="couponName"
            value={formik.values.couponName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Coupon Name"
          />
          {formik.touched.couponName && formik.errors.couponName && (
            <div className="text-red-600">{formik.errors.couponName}</div>
          )}
        </div>

        {/* Price, Stock, Color Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Coupon Code
            </label>
            <input
              type="text"
              id="couponCode"
              name="couponCode"
              value={formik.values.couponCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Coupon Code"
            />
            {formik.touched.couponCode && formik.errors.couponCode && (
              <div className="text-red-600">{formik.errors.couponCode}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="Date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Price"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-600">{formik.errors.startDate}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Amount
            </label>
            <input
              type="number"
              name="minimumAmount"
              value={formik.values.minimumAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minimum Amount"
            />
            {formik.touched.minimumAmount && formik.errors.minimumAmount && (
              <div className="text-red-600">{formik.errors.minimumAmount}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Expire Date
            </label>
            <input
              type="Date"
              name="expireDate"
              value={formik.values.expireDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Price"
            />
            {formik.touched.expireDate && formik.errors.expireDate && (
              <div className="text-red-600">{formik.errors.expireDate}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Offer</label>
            <input
              type="number"
              id="offer"
              name="offer"
              value={formik.values.offer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Offer %"
            />
            {formik.touched.offer && formik.errors.offer && (
              <div className="text-red-600">{formik.errors.offer}</div>
            )}
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="textarea"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-600">{formik.errors.description}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default AdminAddCoupon;
