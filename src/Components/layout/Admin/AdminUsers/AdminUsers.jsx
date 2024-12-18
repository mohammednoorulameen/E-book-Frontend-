import React, { useEffect, useState } from "react";
import {
  FaFileExport,
  FaFileImport,
  FaPencilAlt,
  FaCopy,
  FaTrashAlt,
} from "react-icons/fa";
import {
  useGetUserListQuery,
  useBlockuserMutation,
} from "../../../../Services/Apis/AdminApi";
const UsersList = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [usersList, SetusersList] = useState([]);
  const [currentPage, SetcurrentPage] = useState(1);
  const { data, isError, refetch } = useGetUserListQuery({
    page: currentPage,
    limit: 10,
  });
  const [blockUser] = useBlockuserMutation();

  console.log('data', data)
  /**
   * handle change page and take total page
   */
  const handlePageChange = (page) => {
    SetcurrentPage(page);
  };
  const totalPage = data?.totalPage;

  /*
  get users list
  */

  useEffect(() => {
    if (data && data.usersList) {
      SetusersList([...data.usersList]);
    }
  }, [data]);

  /*
 handle user block and unblock
 */

  const handleuserblock = async (id) => {
    try {
      await blockUser({ id });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button
            className={`pb-4 px-2 ${
              activeTab === "members"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          {/* <button
            className={`pb-4 px-2 ${activeTab === 'admins' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('admins')}
          >
            Admins
          </button> */}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Members</h2>
          <div className="flex gap-3">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Add new member
            </button>
            {/* <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <FaFileImport />
              Import members
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <FaFileExport />
              Export members 
            </button> */}
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6">No</th>
                <th className="text-left py-4 px-6">Member name</th>
                <th className="text-left py-4 px-6">Mobile</th>
                <th className="text-left py-4 px-6">Email</th>
                <th className="text-left py-4 px-6">Joined on</th>
                <th className="text-left py-4 px-6">Status</th>
                {/* <th className="text-left py-4 px-6">Operations</th> */}
              </tr>
            </thead>
            <tbody>
              {usersList.length > 0 ? (
                usersList.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="py-4 px-6">{user.username}</td>
                    <td className="py-4 px-6">{user.phone}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      {user.createdAt.split("T")[0]}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleuserblock(user._id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Block"}
                      </button>
                    </td>
                    {/* <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="text-gray-600 hover:text-indigo-600">
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-indigo-600">
                        <FaTrashAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  {isError && <h4 className="text-red-400">user not found </h4>}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPage, onPageChange }) => {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          className={`px-3 py-1 mx-1 border rounded ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
          key={page}
          onClick={()=>onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default UsersList;
