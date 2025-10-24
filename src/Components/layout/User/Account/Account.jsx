import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  Key,
  MapPin,
  ShoppingBag,
  Settings,
  Wallet,
  Share2,
  Bell,
} from "lucide-react";
import { Button, Typography } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Setting from "./Settings";
import { useSelector } from "react-redux";
import {
  ChangePasswordPage,
  EditProfilePage,
  ManageAddressPage,
  NotificationsPage,
  OrderHistoryPage,
  ReferralsPage,
  WalletPage,
} from "../../../../Pages/User/AccountPage";

const menuItems = [
  { name: "EditProfile", icon: UserCircle, path: "edit-profile" },
  { name: "Security", icon: Key, path: "change-password" },
  { name: "Addresses", icon: MapPin, path: "manage-address" },
  { name: "Orders", icon: ShoppingBag, path: "orders" },
  { name: "Wallet", icon: Wallet, path: "wallet" },
  { name: "Referrals", icon: Share2, path: "referrals" },
  { name: "Notifications", icon: Bell, path: "notifications" },
  { name: "Settings", icon: Settings, path: "settings" },
];

export default function Account() {
  const [activeSection, setActiveSection] = useState("Profile");
  const navigate = useNavigate();
  // const { routes } = useParams();
  const location = useLocation();


  useEffect(() => {
    const activeMenuItem = menuItems.find((item) =>
      location.pathname.includes(item.path)
    );
    if (activeMenuItem) {
      setActiveSection(activeMenuItem.name);
    }
  }, [location.pathname]);

  /**
   * handle which component are selecting
   */

  const handleSectionClick = (item) => {
    setActiveSection(item.name);
    navigate(`/account/${item.path}`);
  };

  /**
   * get user detailes
   */
  const userData = useSelector((state) => state.user.userProfile);

  const renderContent = () => {
    switch (activeSection) {
      case "EditProfile":
        return <EditProfilePage />;
      case "Security":
        return <ChangePasswordPage />;
      case "Addresses":
        return <ManageAddressPage />;
      case "Orders":
        return <OrderHistoryPage />;
      case "Wallet":
        return <WalletPage />;
      case "Referrals":
        return <ReferralsPage />;
      case "Notifications":
        return <NotificationsPage />;
      case "Settings":
        return <Setting />;
      default:
        return <EditProfilePage />;;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-center text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Account
        </motion.h1>

        {/* Card with mobile responsiveness */}
        <Card className="overflow-hidden">
          <CardContent>
            <div className="flex items-center space-x-4 sm:flex-col sm:items-start">
              <Avatar
                className="h-16 w-16 sm:h-12 sm:w-12"
                src="/placeholder.svg?height=40&width=40"
                alt={userData.username}
              />
              <div>
                <Typography
                  variant="h6"
                  className="text-xl font-semibold text-gray-900 sm:text-center"
                >
                  Welcome, {userData.username}!
                </Typography>
                <Typography
                  variant="body2"
                  className="text-sm text-gray-500 sm:text-center"
                >
                  Manage your account and preferences here
                </Typography>
              </div>
            </div>
          </CardContent>

          <CardContent className="p-0">
            {/* Navigation menu - horizontally scrollable on mobile */}
            <nav className="flex overflow-x-auto py-4 px-6 bg-white border-b border-gray-200 sm:flex-wrap sm:justify-center sm:py-2">
              {menuItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === item.name
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => handleSectionClick(item)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden sm:block">{item.name}</span>
                </Button>
              ))}
            </nav>

            {/* Content Area with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



