import React, { useEffect, useState } from "react";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../../../Services/Apis/UserApi";
// import { setCredentials } from "../../../../Redux/Slice/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const Otp = () => {
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const { userId } = useParams();
  const [timer, setTimer] = useState(59);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    verifyOtp,
    { isLoading: isVerifyLoading, isError: isVerifyError, error: verifyError },
  ] = useVerifyOtpMutation();
  const [
    resendOtp,
    { isSuccess: isResendSuccess, isError: isResendError, error: resendError },
  ] = useResendOtpMutation();

  /*
     user otp timer
     */

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  /*
 user otp Submit
 */

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Otp must be 6 digits");
      return;
    }

    try {
      const response = await verifyOtp({ userId, otp });
      console.log(response);
      // if (response && response.access_token) {
      //   setOtp("");
      //   setError("");
      //   // dispatch(setCredentials(response.access_token));
      //   localStorage.setItem()
      //   navigate("/login");
      // }
      if('data' in response){
        localStorage.setItem('userToken',response.data.access_token)
        localStorage.removeItem('email');
        navigate('/')
        window.location.reload(); 
      }
      console.log("OTP Submitted:", otp);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  /*
     handle resend otp
     */

  const HandleResendOtp = async () => {
    try {
      setError("");
      await resendOtp({ userId }).unwrap();
      setTimer(59);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Please enter the OTP sent to your email to verify your account.
        </p>
        {error && (
         <div className="flex justify-center items-center mb-3">
         <span className="text-center text-red-500">{error}</span>
       </div>
        )}
        {verifyError && (
         <div className="flex justify-center items-center mb-3">
         <span className="text-center text-gray-700">
           {verifyError?.data?.message || "Failed OTP Verification"}
         </span>
       </div>
        )}
        {isResendSuccess && (
          <div className="flex justify-center items-center mb-3">
          <span className="text-center text-green-500">
            New OTP sent to your email
          </span>
        </div>
        )}
        <form onSubmit={HandleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => {
              setError("");
              setOtp(e.target.value);
            }}
            className="text-center p-3 text-2xl tracking-widest w-2/3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="123456"
          />
          <button
            type="submit"
            className="w-full mt-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isVerifyLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <div className="relative text-center mt-4 text-sm text-gray-600">
          Didn't receive the OTP?{" "}
          <button
            disabled={timer > 0}
            onClick={HandleResendOtp}
            className={`text-blue-500 hover:underline ${
              timer > 0 ? "text-gray-500" : "text-black-500"
            }`}
          >
            Resend OTP
          </button>
          <span className="absolute right-1 top-1/2 -translate-y-1/2">
            {timer > 0 && timer + " s"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Otp;
