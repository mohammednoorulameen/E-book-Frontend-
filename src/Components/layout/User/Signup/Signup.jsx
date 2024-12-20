import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRegisterMutation } from "../../../../Services/Apis/UserApi.js";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../../Services/firebase/firebaseConfig.js";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Name is required")
    .min(4, "Username must be at least 4 characters")
    .max(15, "Username cannot be more than 15 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10,11}$/, "Enter a valid phone number"),

  password: Yup.string()
    .matches(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9].*[0-9].*[0-9].*[0-9])/,
      "Password must cantain at least one special character and atleast four numbers"
    )
    .min(4, "Password must be at least 4 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must be match ")
    .required("Confirm Password is required"),
  //   referralCode: Yup.string()
  // .matches(/^[A-Za-z0-9]{6,10}$/, "Invalid referral code")
  // .optional(),

});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [register,{data, isSuccess, isError, error : authError}]=useRegisterMutation()
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (userdata) => {
      console.log('userData', userdata)
      try {
        const response=await register(userdata)
        console.log(response);
      } catch (error) {}
    },
  });
  // console.log("check data",data)

  useEffect(()=>{
    if (isSuccess && data?.userId) {
      navigate(`/verifyotp/${data?.userId}`)
    }

  },[isSuccess,navigate])

  /**
   * HandleGoogleAurhentication
   */
  const HandleGoogleAurhentication = async (e)=>{
    const provider = await new GoogleAuthProvider();
    return signInWithRedirect(auth,provider)

  }

  return (
    <div>
      <div className="flex  bg-slate min-h-full flex-1 flex-col justify-center px-6 py-12 pt-20 lg:px-8">
        {/* <hr className="w-1/2 mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" /> */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 md:text-4.5xl text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark">
            Create Your Account
          </h2>
        </div>
        {isError && (
         <div className="flex justify-center mt-5">
         <span className="text-center text-red-700">{authError?.data?.message}
         </span>
       </div>
        )}
        {isSuccess && (
          <h3 className="text-green-500">Signup successfull</h3>
        )}
        
        <div className=" mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6 pt-2">
            <div>
              <div className="">
                <label className="block text-sm font-medium text-gray-900">
                  User Name
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    className="w-full p-2  border border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-600">{formik.errors.username}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-900 pt-2">
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
                  htmlFor="email"
                  className="block text-sm font-medium  text-gray-900 pt-2"
                >
                  Mobile Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="tel"
                    autoComplete="tel"
                    className="w-full p-2  border border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-600">{formik.errors.phone}</div>
              )}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium  text-gray-900 pt-2"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    // type="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full p-2  border border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center"
          >
            {showPassword ? (
              < Eye className="h-5 w-5 text-gray-500" />
            ) : (
              < EyeOff className="h-5 w-5 text-gray-500" />
            )}
          </button>
                </div>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600">{formik.errors.password}</div>
              )}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium  text-gray-900 pt-2"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="password"
                    autoComplete="current-password"
                    className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                
              </div>

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-600">
                    {formik.errors.confirmPassword}
                  </div>
                )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium  text-gray-900 pt-2"
                >
                  Referral Code
                </label>
                <div className="mt-2">
                  <input
                    id="referralCode"
                    name="referralCode"
                    value={formik.values.referralCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    autoComplete="current-password"
                    className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                
              </div>


              

              <p className="  text-end text-sm text-gray-500">
                Already have an Account?{" "}
                <Link
                  to="/login"
                  className="font-semibold  text-black hover:underline"
                >
                  Login Here
                </Link>
              </p>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className=" w-4/12 justify-center bg-white border border-black text-black px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
              >
                Sign Up
              </button>
            </div>
            <div className="text-slate-950 mt-10 items-center grid-cols-3 grid">
              <hr className="text-slate-950" />
              <p className="text-center">OR</p>
              <hr className="text-slate-950" />
            </div>
              </form>
            <div>
              <button
                className="bg-white border-2 py-2 w-full mb-24 flex hover:border-black duration-300"
                type="button"
              >
                <div className="mx-auto flex">
                  <button type="button" onClick={HandleGoogleAurhentication} className=" font-tertiary  ms-5 font-semibold ">
                    Continue With Google
                  </button>
                </div>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
