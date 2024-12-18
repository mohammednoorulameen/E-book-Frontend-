import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useChangePassMutation } from '../../../../Services/Apis/UserApi'
const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("password is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9].*[0-9].*[0-9].*[0-9])/,
      "Password must cantain at least one special character and atleast four numbers"
    )
    .min(4, "Password must be at least 4 characters")
    .required("password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "password must be match")
    .required("Confirm Password is required"),
});

const ChangePassword = () => {
const [ChangePass,{error,isSuccess}] = useChangePassMutation()
const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  /**
   * handle password visibility
   */

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /**
   * handle submit
   */

  const formik =  useFormik({
    initialValues:{
        currentPassword : "",
        password : "",
        confirmPassword : ""
    },

    validationSchema : validationSchema,
    onSubmit:async (passValues) => {
      const response = await ChangePass(passValues)
   try {
    if (response.data) {
        formik.resetForm();
        console.log("password successfully changed"); 
      }
   } catch (error) {
    console.log(error);

    if (error?.status === 401 || error?.status === 403) {
        console.log("Session expired, please log in again.");
      } else if (error?.status === 400) {
        console.log("Incorrect current password.");
      } else {
        console.log("An unexpected error occurred.");
      }
   }
    }
  })

  /**
   * handle forgot password
   */

 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Change Password
        </h2>
        {error &&  <p className="text-red-500">not match</p> }
        {isSuccess && <p className="text-green-500">success</p> }
        <Link

          to="/forgot-password"
          className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors duration-150 ease-in-out"
        >
          Forgot password?
        </Link>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
  {[
    { label: "Current Password", name: "currentPassword", field: "currentPassword" },
    { label: "New Password", name: "password", field: "newPassword" },
    { label: "Confirm New Password", name: "confirmPassword", field: "confirmNewPassword" },
  ].map(({ label, name, field }, index) => (
    <div key={index}>
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword[field] ? "text" : "password"}
          id={field}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="block text-sm  bg-gray-100 font-medium w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition ease-in-out duration-300 placeholder-opacity-75"
        />
        {formik.touched[name] && formik.errors[name] && (
          <div className="text-red-600">{formik.errors[name]}</div>
        )}
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
        >
          {showPassword[field] ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  ))}
  
  <motion.button
    type="submit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
  >
    Update Password
  </motion.button>
</form>
</motion.div>
  );
};

export default ChangePassword;










