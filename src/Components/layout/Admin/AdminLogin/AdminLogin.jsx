import React from "react";
import {  useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
// import { setAdminCredentails } from "../../../../Redux/Slice/AuthSlice.js";
import { useAdminLoginMutation } from "../../../../Services/Apis/AdminApi.js";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("invalid email format")
    .required("email is required"),
  password: Yup.string()
    .min(4, "password must be at least 4 characters")
    .required("password is required"),
});

const Login = () => {
  const [adminLogin, {  isError, isSuccess, error: authError }] =
  useAdminLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (userData) => {
      try {
        console.log(userData);
        
        const response = await adminLogin(userData);
        console.log("check response ",response)
         if (response.data) {
          // console.log('check', check)
        localStorage.setItem('adminToken',response.data.access_token)
        navigate("/admin/dashboard")
        window.location.reload();
        }
      } catch (error) {
        console.log("error : ", error);
      }
    },
  });
  return (
    <div>
      <div className="flex  bg-slate min-h-full flex-1 flex-col justify-center px-6 py-12 pt-20 lg:px-8">
        <hr className="mt-16 w-1/2 mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-16 md:text-4.5xl text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark">
           Admin Login  Account
          </h2>
        </div>
        
        <div className=" mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        {isError && (
          <div className="flex justify-center items-center ">
            <span className="text-center text-red-500">
              {authError?.data?.message}
            </span>
          </div>
        )}
        
        {isSuccess && (
          <div className="flex justify-center items-center mb-3">
            <span className="text-center text-green-500">Login Success</span>
          </div>
        )}
          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6 pt-2">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    autoComplete="email"
                    className="w-full p-2  border border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-600">{formik.errors.email}</div>
              )}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium  text-gray-900"
                >
                  Password
                </label>
              </div>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="password"
                  autoComplete="current-password"
                  className="w-full p-2  border border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600">{formik.errors.password}</div>
              )}
              <div className="grid grid-cols-2 ">
                <div>
                  <p className="  text-start text-sm text-gray-500">
                    <a
                      href="#"
                      className="font-semibold  text-black hover:underline"
                    >
                      Forgotpassword?
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className=" w-4/12 justify-center bg-white border border-black text-black px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
              >
                Login 
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
