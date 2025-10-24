
import { Card, CardContent, CardHeader } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { useLogoutMutation } from "../../../../Services/Apis/UserApi";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../../Redux/Slice/UserSlice/UserSlice";
import { useNavigate } from "react-router-dom";




const Setting = () => {

 const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
    /**
   * handle logout
   */

  const HandleLogout = async () => {
    await logout();
    localStorage.removeItem("userToken");
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Account Settings</h2>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Typography>Language Preference</Typography>
          </CardHeader>
          <CardContent>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>English</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Typography>Time Zone</Typography>
          </CardHeader>
          <CardContent>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>UTC-6 (Central Time)</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Typography>Delete Account</Typography>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button onClick={HandleLogout} variant="contained" color="error" halfWidth>
              Logout Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setting;
