import { useEffect, useState } from "react";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../../../Services/Apis/UserApi";
// import { setCredentials } from "../../../../Redux/Slice/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  TOAST_ERROR,
  TOAST_INFO,
  TOAST_SUCCESS,
} from "../../../../Utils/ToastConfige/ToastConfig";

const Otp = () => {
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const { userId } = useParams();
  const [timer, setTimer] = useState(59);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const [verifyOtp, { isLoading: isVerifyLoading, error: verifyError }] =
    useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  /* ---------------- Timer Countdown ---------------- */

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

  /* ---------------- Handle Submit ---------------- */

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Otp must be 6 digits");
      toast.error("OTP must be exactly 6 digits!", TOAST_ERROR);
      return;
    }

    try {
      const response = await verifyOtp({ userId, otp });
      console.log(response);
      if ("data" in response) {
        localStorage.setItem("userToken", response.data.access_token);
        localStorage.removeItem("email");
        toast.success("OTP verified successfully!", TOAST_SUCCESS);
        navigate("/");
        window.location.reload();
      }

      console.log("OTP Submitted:", otp);
    } catch (error) {
      setError(error.response.data.message);
      toast.error(
        error?.data?.message || "Invalid or expired OTP!",
        TOAST_ERROR
      );
    }
  };

  /*
     handle resend otp
     */

  const HandleResendOtp = async () => {
    try {
      setError("");
      await resendOtp({ userId }).unwrap();
      toast.info("A new OTP has been sent to your email.", TOAST_INFO);
      setTimer(59);
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error?.data?.message || "Failed to resend OTP.", TOAST_ERROR);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
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
        {/* {isResendSuccess && (
          <div className="flex justify-center items-center mb-3">
            <span className="text-center text-green-500">
              New OTP sent to your email
            </span>
          </div>
        )} */}
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
          Didn&apos;t receive the OTP?{" "}
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
