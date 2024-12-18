import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useLoginMutation, useGoogleAuthMutation } from "../../../../Services/Apis/UserApi";
import {  signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../../Services/firebase/firebaseConfig.js";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("invalid email format")
    .required("email is required"),
  password: Yup.string()
    .min(4, "password must be at least 4 characters")
    .required("password is required"),
});

const Login = () => {
  const [login, {  isError, isSuccess, error: authError }] =
    useLoginMutation();
    const [GoogleAuth] = useGoogleAuthMutation()
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (userData) => {
      
      try {
        const response = await login(userData);
        console.log('response.data', response)
        if ( response.data) {
          localStorage.setItem('userToken',response.data.access_token);
          navigate("/");
          window.location.reload();
        }
      } catch (error) {
        console.log("error : ", error);
      }
    },
  });
   /**
   * HandleGoogleAurhentication
   */

   const HandleGoogleAurhentication = async ()=>{
    try {
      // console.log(check)
      const result = await signInWithPopup(auth, provider);
      const user  = result.user;
      const userToken = await user.getIdToken();
      const response = await GoogleAuth({userToken})
      console.log('response', response)
      if (response.data) {
        localStorage.setItem('userToken',response.data.access_token);
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      
    }

  }
  return (
    <div>
      <div className="flex  bg-slate min-h-full flex-1 flex-col justify-center px-6 py-12 pt-20 lg:px-8">
        {/* <hr className="w-1/2 mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" /> */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 md:text-4.5xl text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark">
            Login Your Account
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
                    <Link
                      to={'/forgot-password'}
                      className="font-semibold  text-black hover:underline"
                    >
                      Forgotpassword?
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="  text-end text-sm text-gray-500">
                    create account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold  text-black hover:underline"
                    >
                      Signup
                    </Link>
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
            <div className="text-slate-950 mt-10 items-center grid-cols-3 grid">
              <hr className="text-slate-950" />
              <p className="text-center">OR</p>
              <hr className="text-slate-950" />
            </div>

            <div>
              <div
                className="bg-white border-2 py-2 w-full mb-24 flex hover:border-black duration-300"
                type="button"
              >
                <div className="mx-auto flex">
                  <button  onClick={HandleGoogleAurhentication}
                type="button" className=" font-tertiary  ms-5 font-semibold ">
                    Continue With Google
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
