// import React, { useState } from "react";
// import AdminSidebar from "../../../Common/AdminSidebar";
// import { Outlet } from "react-router-dom";
// import AdminNavbar from "../../../Common/AdminNavbar";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <div className=" top-0   h-full">
//         <AdminSidebar sidebarOpen={sidebarOpen} />
//       </div>
//       <div className="flex-1">
//         <AdminNavbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//         <div className="flex-1 overflow-hidden ">
//           <Outlet />
//         </div>
//       </div>{" "}
//     </div>
//   );
// };



import React, { useState } from "react";
import AdminSidebar from "../../../Common/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../../Common/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`top-0 left-0 fixed h-full ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
      >
        <AdminSidebar sidebarOpen={sidebarOpen} />
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-20"
        }`}
      >
        <div className="fixed top-0 left-0 w-full z-10">
          <AdminNavbar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
